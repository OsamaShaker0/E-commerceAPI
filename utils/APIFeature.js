class APIFeatures {
  constructor(req, model) {
    this.req = req;
    this.model = model;
    this.queryObj = { ...req.query };
    this.filter = {};
    this.query = null;
    this.pagination = {};
    this.filterFields = ["sort", "page", "limit", "search", "fields"];
  }

  buildFilter() {
    this.filterFields.forEach(field => delete this.queryObj[field]);

    for (let key in this.queryObj) {
      const [field, operator] = key.split("[");
      if (operator) {
        const mongoOp = `$${operator.replace("]", "")}`;
        this.filter[field] = {
          ...this.filter[field],
          [mongoOp]: Number(this.queryObj[key]),
        };
      } else {
        this.filter[field] = isNaN(this.queryObj[key])
          ? this.queryObj[key]
          : Number(this.queryObj[key]);
      }
    }

    // Search
    if (this.req.query.search) {
      const searchQuery = {
        $or: [
          { title: { $regex: this.req.query.search, $options: "i" } },
          { description: { $regex: this.req.query.search, $options: "i" } },
        ],
      };
      this.filter = { ...this.filter, ...searchQuery };
    }

    // Initialize base query
    this.query = this.model.find(this.filter);
    return this;
  }

  async paginate() {
    const page = Math.max(1, parseInt(this.req.query.page) || 1);
    const limit = Math.max(1, parseInt(this.req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const count = await this.model.countDocuments(this.filter);
    const totalPages = Math.ceil(count / limit);

    this.pagination = {
      totalItems: count,
      page,
      limit,
      pages: totalPages,
    };

    if (page > 1) this.pagination.prevPage = page - 1;
    if (page < totalPages) this.pagination.nextPage = page + 1;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }

  sort() {
    const sortBy = this.req.query.sort
      ? this.req.query.sort.split(",").join(" ")
      : "-createdAt";

    this.query = this.query.sort(sortBy);
    return this;
  }

  limitFields() {
    const fields = this.req.query.fields;

    if (fields) {
      const fieldArray = fields.split(",");
      const hasInclusion = fieldArray.some(f => !f.startsWith("-"));
      const hasExclusion = fieldArray.some(f => f.startsWith("-"));

      if (hasInclusion && hasExclusion) {
        throw new Error("Cannot mix inclusion and exclusion in fields.");
      }

      this.query = this.query.select(fieldArray.join(" "));
    }

    return this;
  }

  populate(path, select = "") {
    this.query = this.query.populate(path, select);
    return this;
  }

  getQuery() {
    return [this.query, this.pagination];
  }
}

module.exports = APIFeatures;

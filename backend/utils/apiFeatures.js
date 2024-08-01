class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  search() {
    let keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    this.query.find({ ...keyword });
    return this;
  }
  filter() {
    let word = { ...this.queryStr };
    // * separate the category from the params
    const remove = ["keyword", "limit", "pages"];
    remove.forEach((value) => delete word[value]);
    // * replacing the price limit  $ symbol
    let values = JSON.stringify(word);
    values = values.replace(/\b(gt|get|lt|lte)\b/g, (match) => `$${match}`);
    this.query.find(JSON.parse(values));
    return this;
  }
  paginate(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skipCount = resPerPage * (currentPage - 1);
    this.query = this.query.limit(resPerPage).skip(skipCount);
    return this;
  }
}

module.exports = APIFeatures;

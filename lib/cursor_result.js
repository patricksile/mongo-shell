class CursorResult {
  constructor(documents, hasMore) {
    this.documents = documents;
    this.hasMore = hasMore;
  }

  render(options = {}) {
    let results = this.documents.map(doc => {
      return JSON.stringify(doc).replace(/,/g, ', ').replace(/:/g, ': ');
    });
    if (this.hasMore) {
      results.push('Type "it" for more');
    }
    return results.join('\n');
  }
}

module.exports = CursorResult;
const mongoose = require('mongoose');

// Schema for Bookmark
const searchSuggestionSchema = new mongoose.Schema({
    search: Array,
});

// model for SearchSuggestion
const SearchSuggestion = mongoose.model('SearchSuggestion', searchSuggestionSchema);

module.exports = SearchSuggestion;
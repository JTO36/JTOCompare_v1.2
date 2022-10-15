const { response } = require('express');

const axios = require('axios').default;
async function getInfo(URL, params) {
    try {
        const response = await axios.get(URL, params);
        return response.data;
    } catch (error) {
        return error;
    }
}

function searchWordDefinition(word) {
    return getInfo(dict_URL + word);
}

var dict_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
var words = ["dog"];

searchWordDefinition(words);
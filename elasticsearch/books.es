PUT books 
{
    "settings": {
        "index": {
            "number_of_shards": 1,
            "number_of_replicas": 0,
            "max_ngram_diff": 2
        },
        "analysis": {
            "filter": {
                "english_stop": {
                    "type": "stop",
                    "stopwords": "_english_"
                },
                "english_stemmer": {
                    "type": "stemmer",
                    "language": "english"
                },
                "english_possessive_stemmer": {
                    "type": "stemmer",
                    "language": "possessive_english"
                },
                "ngram": {
                  "type": "ngram",
                  "min_gram": 2,
                  "max_gram": 4,
                  "token_chars": [
                        "letter",
                        "digit"
                    ]
                },
                "edge_ngram": {
                  "type": "edge_ngram",
                  "min_gram": 2,
                  "max_gram": 16
                }
            },
            "analyzer": {
                "base_analyzer": {
                    "tokenizer": "standard",
                    "filter": [
                      "lowercase",
                      "ngram",
                      "edge_ngram"
                    ]
                }
            }
        }
    },
    "mappings": 
    {
        "properties": {
            "authors": {
                "type": "text",
                "analyzer": "base_analyzer"
            },
            "title": {
                "type": "text",
                "analyzer": "base_analyzer"
            },
            "desc": {
                "type": "keyword",
                "index": false
            },
            "genres": {
                "type": "text",
                "analyzer": "base_analyzer"
            },
            "pages": {
                "type": "integer",
                "index": false
            },
            "rating": {
                "type": "float"
            },
            "rating_count": {
                "type": "integer"
            },
            "price": {
                "type": "keyword",
                "index": false
            },
            "year": {
                "type": "integer",
                "index": false
            },
            "image_url": {
                "type": "keyword",
                "index": false
            }
        }
    }
}

GET books/_search
{
  "size" : 10,
  "query": {
    "match": {
          "authors": {
            "query": "jane"
          }
        }
  }
}

GET books/_doc/7ZjoPXIBk6_coDgKK5Nq

---------------------------DELETE-------------------------
POST books/_delete_by_query
{
  "query": {
        "match_all": {}
    }
}

DELETE books

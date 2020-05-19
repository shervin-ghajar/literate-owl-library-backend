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
                  "max_gram": 4
                },
                "edge_ngram": {
                  "type": "edge_ngram",
                  "min_gram": 2,
                  "max_gram": 16
                }
            },
            "analyzer": {
                "rebuilt_english": {
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
                "analyzer": "rebuilt_english"
            },
            "title": {
                "type": "text",
                "analyzer": "rebuilt_english"
            },
            "desc": {
                "type": "keyword",
                "index": false
            },
            "genres": {
                "type": "keyword"
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
                "type": "float",
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

---------------------------DELETE-------------------------
POST books/_delete_by_query
{
  "query": {
        "match_all": {}
    }
}

DELETE books

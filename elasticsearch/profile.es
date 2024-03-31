
PUT profile 
{
    "settings": {
        "index": {
            "number_of_shards": 1,
            "number_of_replicas": 0
        }
    },
    "mappings": 
    {
        "properties": {
            "username":{
                "type":"keyword",
                "index":false
            },
            "email":{
                "type":"keyword"
            },
            "password":{
                "type":"keyword"
            },
            "balance":{
                "type":"float"
            },
            "wishlist":{
                "type":"keyword"
            },
            "purchased":{
                "type":"keyword"
            }
        }
    }
}

PUT profile/_doc/ssghajar@gmail.com
{
    "username":"ssghajar",
    "email":"ssghajar@gmail.com",
    "password":"1480"
}
GET profile/_doc/ssghajar@gmail.com

GET profile/_search
{
  "query": {
        "match_all": {}
    }
}

// ---------------------------DELETE-------------------------
POST profile/_delete_by_query
{
  "query": {
        "match_all": {}
    }
}

POST profile/_delete_by_query
{
  "query": {
        "match_all": {}
    }
}

DELETE profile

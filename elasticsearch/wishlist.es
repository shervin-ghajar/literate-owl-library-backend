
PUT wishlist 
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
            "userId":{
                "type":"keyword"
            },
            "list":{
                "type":"keyword"
            }
        }
    }
}
POST wishlist/_delete_by_query
{
  "query": {
        "match_all": {}
    }
}

DELETE profile
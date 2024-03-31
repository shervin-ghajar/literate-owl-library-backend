const config = {
    "secret": "Literate_Owl_Library_Secret",
    "redis": {
        "port": 6379,
    },
    "elasticsearch": {
        "port": 9200,
        "indices": {
            book_index: "books",
            profile_index: "profile"
        }
    }
}

export { config }
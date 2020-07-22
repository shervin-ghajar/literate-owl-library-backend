import { Client } from '@elastic/elasticsearch';
const esClient = new Client({ node: 'http://localhost:9200' });
import { config } from '../../../config';
const index = config.elasticsearch.indices.profile_index
//--------------------------------------------------------------------------------------------
async function getProfile(userId) {
    try {
        const { body } = await esClient.get({
            index,
            id: userId,
        })
        if (body.found) {
            let { username, email, password, balance, wishlist, purchased } = body._source
            let response = {
                username,
                email,
                password,
                balance,
                wishlist,
                purchased
            }
            return response
        }
        return null
    } catch (error) {
        console.error("getProfile-error", error)
        return error
    }
}
//--------------------------------------------------------------------------------------------
export { getProfile, }
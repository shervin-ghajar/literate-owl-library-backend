import { Client } from '@elastic/elasticsearch';
const esClient = new Client({ node: 'http://localhost:9200' });
import { config } from '../../../config';
const index = config.elasticsearch.indices.profile_index
//------------------------------------------GET PROFILE--------------------------------------------------
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
//------------------------------------------UPDATE PROFILE----------------------------------------
async function updateProfile(userId, username, password) {
    try {
        const { body } = await esClient.update({
            index,
            id: userId,
            body: {
                doc: {
                    username: username.trim(),
                    password: password.trim()
                }
            }
        })
        console.log("updateProfile", body)
        let response = body.result && (body.result == 'updated' || body.result == 'noop') ? body.result : false
        return response
    } catch (error) {
        console.error("getProfile-error", error)
        throw error
    }
}
//-----------------------------------------------------------------------------------------------
export { getProfile, updateProfile }
import { Client } from '@elastic/elasticsearch';
const esClient = new Client({ node: 'http://localhost:9200' });
import { config } from '../../../config';
import { tokenGenerator } from '../../redis/services/token';
const index = config.elasticsearch.indices.profile_index
//------------------------------------------GET PROFILE--------------------------------------------------
async function getProfile(userId, userProfileConflict) {
    try {
        const { body } = await esClient.get({
            index,
            id: userId,
        })
        if (body.found) {
            if (userProfileConflict) return true
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
    } catch (error) {
        console.error("getProfile-error", error)
        throw error
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
//------------------------------------------CREATE PROFILE----------------------------------------
async function createProfile(agent, email, username, password) {
    try {
        const { body } = await esClient.index({
            index,
            id: email,
            body: {
                username,
                email,
                password,
                balance: 0,
                wishlist: [],
                purchased: []
            }
        })
        await esClient.indices.refresh({ index: 'profile' })
        if (body.result == 'created') {
            return tokenGenerator(agent, email).then(token => {
                return token
            }).catch(err => {
                console.log("tokenGeneratorError", err)
                throw err
            })
        }
    } catch (error) {
        console.error("createProfileError", error)
        throw error
    }
}
//-----------------------------------------------------------------------------------------------
export { getProfile, updateProfile, createProfile }
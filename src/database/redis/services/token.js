import redis from 'redis';
const redisClient = redis.createClient();
import jwt from 'jsonwebtoken';
import { config } from '../../../config';
//-----------------------------------------------------------------------------------------------
async function tokenGenerator(agent, userId) {
    try {
        let key = `${userId}_${agent}`
        let token = jwt.sign({ token: key }, config.secret)
        redisClient.set(key, token)
        return token
    } catch (error) {
        throw error
    }
}
//-----------------------------------------------------------------------------------------------

async function tokenValidator(authorization, agent, userId, error) {
    try {
        if (authorization && agent) {
            let authToken = authorization.slice(7, authorization.length)
            jwt.verify(authToken, config.secret, (jwtErr, decoded) => {
                if (!(decoded && 'token' in decoded)) {
                    console.error("jwtErr", jwtErr)
                    error(401)
                    return;
                }
                redisClient.get(decoded.token, (err, reply) => {
                    if (reply) {
                        let agentIndex = decoded.token.search(agent)
                        console.log(agentIndex, decoded.token)
                        if (agentIndex != -1) {
                            let id = decoded.token.slice(0, agentIndex - 1)
                            userId(id)
                        } else {
                            error(401)
                        }
                    } else {
                        error(401)
                    }
                })
            })
        } else {
            error(400)
        }
    } catch (error) {
        throw error
    }
}
//-----------------------------------------------------------------------------------------------
async function deleteToken(authorization, agent, response, error) {
    try {
        if (authorization && agent) {
            let authToken = authorization.slice(7, authorization.length)
            jwt.verify(authToken, config.secret, (jwtErr, decoded) => {
                console.error("jwtErr", jwtErr, decoded)
                if (!(decoded && 'token' in decoded)) {
                    return error(401)
                }
                redisClient.del(decoded.token)
                response(true)
            })
        } else {
            error(400)
        }
    } catch (error) {
        throw error
    }
}
//-----------------------------------------------------------------------------------------------
export { tokenValidator, tokenGenerator, deleteToken }
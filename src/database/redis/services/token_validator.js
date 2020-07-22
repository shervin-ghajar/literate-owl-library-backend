import redis from 'redis';
const redisClient = redis.createClient();
import jwt from 'jsonwebtoken';
import { config } from '../../../config';
//-----------------------------------------------------------------------------------------------
async function tokenValidator(authorization, agent, userId, error) {
    try {
        if (authorization && agent) {
            let authToken = authorization.slice(7, authorization.length)
            jwt.verify(authToken, config.secret, (jwtErr, decoded) => {
                if (!(decoded && 'token' in decoded)) {
                    console.error("jwtErr", jwtErr)
                    error(401)
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
export { tokenValidator }
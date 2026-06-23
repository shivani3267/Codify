import jwt from 'jsonwebtoken'

const getToken = (data) => {
    const token = jwt.sign(data, process.env.JWT_SECRET_KEY, {expiresIn:3600});
    return token;
}
export default getToken;

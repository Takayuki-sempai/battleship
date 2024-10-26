export const IdGenerator = () => {
    let currentUserId = 0;
    const getNextId = () => ++currentUserId
    return {getNextId}
}
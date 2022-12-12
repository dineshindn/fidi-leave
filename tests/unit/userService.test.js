const {userService} = require('../../src/services');

describe('userService Unit testing',()=>{
    it('test user req count update',async()=>{
        const userId = 'SGvL4n7sPRwvzHTq6ls9';
        const status = 'pending';
        const count = -1;
        const res = await userService.updateleaverequestcount(userId,status,count);
        console.log(res);
        expect(res).toBeDefined();
    })
})
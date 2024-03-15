import { expect } from "chai";
import supertest from "supertest";
import { describe, before, it } from "mocha";

const requester = supertest('http://localhost:8080');

const testUserLogin = {
    email: 'kevin@hotmail.com',
    password: 'kevin',
};
const testUserLogin1 = {
    email: 'cspdskeviinn@hotmail.com',
    password: 'kevin'
};


describe('testing products', function () {
    this.timeout(15000);

    describe('test product creacion', function () {

        let sessionCookie;
        let userData;
        let productId;
        before(async function () {
            productId = '65b9ac7ffc45afd2edb40c57';
        });
        it('POST /api/sessions/login debe logear correctamente   ', async function () {

            const result = await requester.post('/api/sessions/login').send(testUserLogin);
            expect(result.status).to.equal(302);
            expect(result.headers.location).to.equal('/');
            sessionCookie = result.headers['set-cookie'][0];
            console.log(sessionCookie);
            const userDataString = sessionCookie
                .split('user=')[1]
                .split(';')[0];
            const decodedUserDataString = decodeURIComponent(userDataString);
            console.log(decodedUserDataString);
            userData = JSON.parse(decodedUserDataString);

        });


        it('DELETE /cart/:userId/products/:productId debe eliminar un producto del carrito', async function () {
            this.timeout(30000);

            let userId = userData._id;

            try {
                const response = await requester.delete(`/cart/${userId}/products/${productId}`)
                    .set('Cookie', sessionCookie)
                    .timeout(600000);
                expect(response.status).to.equal(200);
            } catch (error) {
                if (error.code === 'ECONNRESET') {
                    console.log('Se restableció la conexión. Reintentando solicitud...');
                } else {
                    throw error;
                }
            }
        });
    });
});




// it('POST /api/carts/add/:productId/:quantity debe agregar producto al carrito', async function () {
//     this.timeout(50000);
//     const productId = '65b9ac7ffc45afd2edb40c57';
//     const quantity = 1;
//     const result = await requester.post(`/api/carts/add/${productId}/${quantity}`)
//         .set('Cookie', userSession);

//     expect(result);

// });
import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import { describe } from "mocha";

const requester = supertest('http://localhost:8080');
const connection = mongoose.connect('mongodb+srv://coder_55605:coder_55605@cluster0.fuyh6ix.mongodb.net/ecommerce');

const testProduct = {
    title: '2',
    description: '2',
    price: 1099,
    stock: 100,
    category: '2',
    code: '2',
    thumbnail: 'https://example.com/thumbnail.jpg',
    owner: 'jhon@hotmail.com'
};

const testUserLogin = {
    email: 'jhon@hotmail.com',
    password: 'hola'
};

const adminDeleteProduct = {
    email: 'adminCoder@coder.com',
    password: 'adminCod3r123'
}
const newTitle = 'asdsdadsadsadsa';


describe('testing products', function () {
    this.timeout(15000);

    describe('test product creation', function () {
        let sessionCookie;
        let userData;
        let productId; 
        let productIdDelete;

        before(async function () {

            await mongoose.connection.collection('products');
            await mongoose.connection.collection('users');
            productId = '65e11346c2ebd6b54b280974';
            productIdDelete = '65f11994fff20ffa38d94a0d';
        });

        it('POST /api/sessions/login debe iniciar sesión correctamente', async function () {
            const result = await requester.post('/api/sessions/login').send(adminDeleteProduct);

            expect(result.status).to.equal(302);
            expect(result.headers.location).to.equal('/');
            sessionCookie = result.headers['set-cookie'][0];
            console.log(sessionCookie);

            const userDataString = sessionCookie.split('user=')[1].split(';')[0];
            const decodedUserDataString = decodeURIComponent(userDataString);
            userData = JSON.parse(decodedUserDataString);

            console.log(userData);
        });

        it('POST /api/products debe crear un nuevo producto', async function () {
            this.timeout(30000);

            expect(userData).to.exist;
            expect(userData.rol).to.be.oneOf(['premium', 'admin']);

            const result = await requester.post('/api/products')
                .set('Cookie', sessionCookie)
                .send(testProduct);

            expect(result.status).to.equal(201);
        });


        //funciona solo que da un mensaje de error, pero modifica el producto

        it('PUT /api/products/:pid debe actualizar el título de un producto existente', async function () {
            this.timeout(30000);

            const result = await requester.put(`/api/products/${productId}`)
                .send({ title: newTitle });

            expect(result.status).to.equal(200);
        });

        //funciona solo que da un mensaje de error, pero elimina el producto

        it('DELETE /api/products/:pid debe eliminar un producto existente', async function () {
            this.timeout(50000);
            expect(userData).to.exist;
            expect(userData.rol).to.be.oneOf(['premium', 'admin']);
            expect(userData.email).to.exist;
            const result = await requester.delete(`/api/products/${productIdDelete}`)
                .set('Cookie', sessionCookie);

            expect(result.status).to.equal(200);
        });

    });
});

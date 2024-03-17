import { expect } from "chai";
import supertest from "supertest";
import mongoose from "mongoose";
import { describe } from "mocha";
import cookie from 'cookie';

const requester = supertest('http://localhost:8080');
const connection = mongoose.connect('mongodb+srv://coder_55605:coder_55605@cluster0.fuyh6ix.mongodb.net/ecommerce');

// const testUserRegister = {
//     first_name: 'John',
//     last_name: 'doe',
//     email: 'jhon@hotmail.com',
//     age: 2,
//     gender: 'male',
//     password: 'hola'
// }

// const testUserLogin = {
//     email: 'jhon@hotmail.com',
//     password: 'hola'
// };

describe('testing users', function () {
    describe('test user', function () {
        let sessionCookie;

        before(async function () {
            await mongoose.connection.collection('users');
        });
        // it('POST /api/sessions/register debe crear un usuario correctamente', async function () {
        //     const result = await requester.post('/api/sessions/register').send(testUserRegister)
        //     console.log(result)
        // })
        // it('POST /api/sessions/login debe iniciar sesión correctamente', async function () {
        //     const result = await requester.post('/api/sessions/login').send(testUserLogin);

        //     expect(result.status).to.equal(302);
        //     expect(result.headers.location).to.equal('/');
        //     sessionCookie = result.headers['set-cookie'][0] ? cookie.parse(result.headers['set-cookie'][0]) : null;
        // });

        // it('GET /api/sessions/current debe devolver el usuario completo', async function () {
        //     expect(sessionCookie).to.exist;
        //     expect(sessionCookie).to.be.a('object').and.not.empty;

        //     if (sessionCookie) {
        //         const result1 = await requester.get('/api/sessions/current').set('Cookie', `user=${sessionCookie.user}`);
        //         console.log(result1._body);
        //         expect(result1.status).to.equal(200);
        //     } else {
        //         console.log('La cookie de sesión no está definida.');
        //     }
        // });
    });
});
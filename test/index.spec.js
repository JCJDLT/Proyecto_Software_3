import app from "../src/app";
import request from "supertest";

describe("GET /", () => {
    test("deberia responder con un estado 200",async () =>{
        const response = await request(app).get("/").send();
        expect(response.statusCode).toBe(200);
    })
});

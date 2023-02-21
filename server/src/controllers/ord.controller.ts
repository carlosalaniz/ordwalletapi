import { Tags, Route, Security, Controller, Post, Body, Get, Query } from "tsoa";
import { PrismaClient } from '@prisma/client'
import { estimateCost } from "../tooling/utils";
const prisma = new PrismaClient()
@Tags("ord")
@Route("/ordinals")
// @Security('api_key')
export class OrdinalController extends Controller {
    @Get("/")
    async ordIndex(
        @Query() from: number,
        @Query() to: number,
        @Query() limit: number = 2
    ) {
        if (limit > 50) {
            this.setStatus(400);
            return "Sorry, your request is too powerful :(. Ask for a maximum of 50 ordinals at a time."
        }
        return await prisma.ord.findMany({
            where: {
                inscription_number: {
                    gte: from,
                    lte: to,
                },
            },
            take: Math.round(limit)
        })
    }
}
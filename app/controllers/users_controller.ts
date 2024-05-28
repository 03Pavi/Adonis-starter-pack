// import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { createUserValidator } from '#validators/user'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'

/**
 * Creates query builder instance
 */
const query = db.query()

export default class UsersController {
    async createUser({ request, response }: HttpContext) {
        const isValidUser = await request.validateUsing(createUserValidator)
        if (isValidUser) {
            const user = await User.create(request.body())
            return response.status(201).json(user)
        }
    }
    async getUser({ request, response }: HttpContext) {
        try {
            const { limit = 1, page = 2, searchQuery } = request.qs();
            if (request.params().id) {
                const user = await User.findOrFail(request.params().id)
                return user
            } else if (searchQuery) {
                const searchData = (await query.from("users").whereLike("users.name", `%${searchQuery}%`).orWhereLike("users.email", `%${searchQuery}%`))
                return response.json({
                    data: searchData
                })
            } else {
                if (limit || page) {
                    const userList = await query.from("users").paginate(page, limit)
                    return response.json({
                        page,
                        limit,
                        data: userList
                    })

                } else {
                    return response.json({
                        data: query.from("users").select("*")
                    })
                }
            }
        }
        catch (error) {
            return response.status(500).json({
                message: "No valid user with this id"
            })
        }
    }
    async updateUser({ request }: HttpContext) {
        if (request.params().id) {
            await query.from("users").where("id", request.params().id).update(request.body())
            const getUser = await User.find(request.params().id)
            return getUser
        }
    }
    async deleteUser({ request }: HttpContext) {
        if (request.params().id) {
            const user = await User.find(request.params().id)
            if (user) await user.delete()
            return user
        }
    }
}
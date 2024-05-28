import vine from '@vinejs/vine'
export const createUserValidator = vine.compile(
    vine.object({
        name: vine.string().trim(),
        email: vine.string().trim().email()
    })
)
/**
 * prompt 描述
 *
 * 当我们需要让 ai 生成 sql 代码时使用第三方包或者其他文件的代码
 * 一般来说调用的方法是引入第三方文件的对象、函数、类等
 * 在引入之前我们需要介绍每个对象、函数、类的作用
 */
import { z } from 'zod'

/**
 * Q: 为什么不进一步描述对象的引入方法等？
 * A: 我们只需要让 ai 告诉我们他使用了哪些对象，我们可以根据需求，进一步手动生成引用代码
 */
export const usepkgSchema = z.object({
  name: z.string().describe('对象名称'),
  description: z.string().describe('对象作用描述'),
})

export type UsepkgInfer = z.infer<typeof usepkgSchema>

export const kyselyUsepkg: UsepkgInfer = {
  name: 'db',
  description: '它是 `kysely` 的实例对象。`kysely` 是一个操作 数据库 的第三方库。是一个用于 TypeScript 的 SQL 查询构建器。',
}

export const ioredis: UsepkgInfer = {
  name: 'redis',
  description: '它是 `ioredis` 的实例对象。`ioredis` 是一个操作 Redis 的第三方库。',
}

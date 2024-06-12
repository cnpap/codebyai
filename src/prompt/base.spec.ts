import process from 'node:process'
import { describe, expect, it } from 'vitest'
import { ChatOpenAI } from '@langchain/openai'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { JsonOutputFunctionsParser } from 'langchain/output_parsers'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { kyselyUsepkg } from './prompt-usepkg'

const apiKey = process.env.OPENAI_API_KEY
const baseURL = process.env.OPENAI_BASE_URL

describe('关于 llm 第三方库的使用测试', () => {
  const model = new ChatOpenAI({
    model: 'gpt-4o',
    temperature: 0,
    apiKey,
    configuration: {
      baseURL,
    },
  })

  it('判断 gpt-4o 对于 kysely 的基础使用', async () => {
    const schema = z.object({
      code: z.string().describe('可以执行的代码块'),
    })
    const prompt = ChatPromptTemplate.fromTemplate(`
请完成 {table} 表的查询操作，仅包括 id、name、code 字段?
生成的代码仅需包括 const data = [code] 其中的 [code] 这部分代码，请不要包括其他代码。
可以使用的工具有:
  ${kyselyUsepkg.name}
  ${kyselyUsepkg.description}
`,
    )
    const modelParams = {
      functions: [
        {
          name: 'generateCode',
          description: 'Generate code for a given prompt',
          parameters: zodToJsonSchema(schema),
        },
      ],
      function_call: { name: 'generateCode' },
    }
    const chain = prompt
      .pipe(model.bind(modelParams))
      .pipe(new JsonOutputFunctionsParser({ diff: true }))
    const result = await chain.invoke({
      table: 'users',
    }) as { code: string }
    // 去除前后空格、分号等
    result.code = result.code.trim()
    expect(result).toEqual({
      code: `await db.selectFrom('users').select(['id', 'name', 'code']).execute()`,
    })
  })
})

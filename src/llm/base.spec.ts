import process from 'node:process'
import { describe, expect, it } from 'vitest'
import { ChatOpenAI } from '@langchain/openai'
import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'
import { JsonOutputFunctionsParser } from 'langchain/output_parsers'
import { ChatPromptTemplate } from '@langchain/core/prompts'

const apiKey = process.env.OPENAI_API_KEY
const baseURL = process.env.OPENAI_BASE_URL

describe('关于 llm 代码生成能力做基础能力测试', () => {
  it('简单的 json 格式化输出，用于测试 apiKey、baseUrl 是否正常使用', async () => {
    const model = new ChatOpenAI({
      model: 'gpt-3.5-turbo',
      temperature: 0,
      apiKey,
      configuration: {
        baseURL,
      },
    })
    const schema = z.object({
      amount: z.string().describe('计算出来的结果'),
    })
    const prompt = ChatPromptTemplate.fromTemplate(
      '2 + {num} 等于多少? 请只返回结果',
    )
    const modelParams = {
      functions: [
        {
          name: 'sum',
          description: '获取两个数的和',
          parameters: zodToJsonSchema(schema),
        },
      ],
      function_call: { name: 'sum' },
    }
    const chain = prompt
      .pipe(model.bind(modelParams))
      .pipe(new JsonOutputFunctionsParser({ diff: true }))
    const result = await chain.invoke({
      num: '1',
    })
    expect(result).toEqual({ amount: '3' })
  })
})

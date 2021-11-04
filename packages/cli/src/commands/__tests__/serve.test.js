global.__dirname = __dirname

// We mock these to skip the check for web/dist and api/dist
jest.mock('@redwoodjs/internal', () => {
  return {
    getPaths: () => {
      return {
        api: {
          dist: '/mocked/project/api/dist',
        },
        web: {
          dist: '/mocked/project/web/dist',
        },
      }
    },
    getConfig: () => {
      return {
        api: {},
      }
    },
  }
})

jest.mock('fs', () => {
  return {
    ...jest.requireActual('fs'),
    readFileSync: () => 'File content',
    existsSync: () => true,
  }
})

jest.mock('@redwoodjs/api-server', () => {
  return {
    ...jest.requireActual('@redwoodjs/api-server'),
    apiServerHandler: jest.fn(),
    webServerHandler: jest.fn(),
    bothServerHandler: jest.fn(),
  }
})

import yargs from 'yargs'

import { bothServerHandler } from '@redwoodjs/api-server'

import { builder } from '../serve'

describe('yarn rw serve', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should proxy rw serve with params to appropriate handler', async () => {
    const parser = yargs.command('serve [side]', false, builder)

    parser.parse('serve --port 9898 --socket abc')

    expect(bothServerHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        port: 9898,
        socket: 'abc',
      })
    )
  })
})

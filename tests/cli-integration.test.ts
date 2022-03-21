import { system, filesystem } from 'gluegun'

const version = '0.0.5'

const src = filesystem.path(__dirname, '..')

const cli = async (cmd) =>
  system.run('node ' + filesystem.path(src, 'bin', 'nest-clz') + ` ${cmd}`)

test('outputs version', async () => {
  const output = await cli('--version')
  expect(output).toContain(version)
})

test('outputs help', async () => {
  const output = await cli('--help')
  expect(output).toContain(version)
})

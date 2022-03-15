import { GluegunCommand } from 'gluegun'

const command: GluegunCommand = {
  name: 'nest-clz',
  run: async (toolbox) => {
    const { print } = toolbox

    print.divider()
    print.info('Welcome to your CLI')
    print.info('Write `nest-clz help` to see all available commands')
    print.divider()
  },
}

module.exports = command

import { definePlugin } from './index';

export default definePlugin(
  {
    key: 'email-audit',
    name: 'Auditoría de correo',
    version: '1.0.0',
    type: 'report',
    description: 'Genera reportes sobre envíos de correo y tasa de apertura.'
  },
  {
    async onLoad(context) {
      context.log('Plugin email-audit cargado');
      await context.emit('plugins:email-audit:loaded', {});
    }
  }
);

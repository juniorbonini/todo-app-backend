/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { exec } from 'child_process';
import dotenv from 'dotenv';
import { Groq } from 'groq-sdk';
import path from 'path';
import util from 'util';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const execPromise = util.promisify(exec);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

console.log('Chave carregada:', process.env.GROQ_API_KEY ? 'SIM' : 'NÃO');

async function run() {
  try {
    const { stdout: files } = await execPromise('git diff --name-only');
    const { stdout: diff } = await execPromise('git diff', {
      maxBuffer: 1024 * 1024 * 10,
    });

    if (!files.trim()) return console.log('Nenhuma alteração detectada.');

    const prompt = `
Você é um desenvolvedor especialista. Analise os arquivos e o diff abaixo e gere UMA ÚNICA linha de commit seguindo Conventional Commits.
REGRAS:
- Idioma: pt-BR.
- Formato: tipo(escopo): descrição curta (máx 72 caracteres).
- Seja específico e direto.
- Não inclua explicações, apenas a mensagem do commit.

Arquivos: ${files}
Diff: ${diff}
`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return console.log('Nenhuma resposta gerada pelo modelo.');
    }

    const msg = content.trim().replace(/^"|"$/g, '');

    console.log(`Commit gerado: ${msg}`);

    await execPromise('git add .');
    await execPromise(`git commit -m "${msg}"`);
    console.log('Sucesso!');
  } catch (error) {
    console.error('Erro ao gerar commit:', error);
  }
}

run();

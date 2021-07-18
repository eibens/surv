export function run(options: Deno.RunOptions) {
  return async () => {
    const p = Deno.run(options);
    try {
      await p.status();
    } finally {
      closeProcess(p);
    }
  };
}

export function start(options: Deno.RunOptions) {
  let process: Deno.Process | null = null;
  return () => {
    if (process) closeProcess(process);
    process = Deno.run(options);
    try {
      process.status();
    } catch (error) {
      console.error(error);
      closeProcess(process);
      process = null;
    }
    return Promise.resolve();
  };
}

function closeProcess(p: Deno.Process) {
  p.stdin?.close();
  p.stderr?.close();
  p.stdout?.close();
  p.close();
}

const test = require('ava')
const { commandSync: cmd } = require('execa')

const bundlesize = `node ../../../index`

function run(fixture, customParams = '') {
  let output

  try {
    output = cmd(`${bundlesize} ${customParams}`, {
      cwd: `tests/fixtures/${fixture}`,
      env: { INTERNAL_SKIP_CACHE: true },
    })
  } catch (error) {
    output = error
  }

  // make it a little easier to compare
  output.stdout = output.stdout.trim()

  return output
}

test.serial('1. pass: single file smaller than limit', t => {
  const { stdout, exitCode } = run(1)
  t.is(exitCode, 0)
  t.snapshot(stdout)
})

test.serial('2. fail: single file larger than limit', t => {
  const { stdout, exitCode } = run(2)
  t.is(exitCode, 1)
  t.snapshot(stdout)
})

test.serial('3. pass: use brotli', t => {
  const { stdout, exitCode } = run(3)
  t.is(exitCode, 0)
  t.snapshot(stdout)
})

test.serial('4. fail: dont use compression', t => {
  const { stdout, exitCode } = run(4)
  t.is(exitCode, 1)
  t.snapshot(stdout)
})

test.serial('5. pass: custom config file', t => {
  const { stdout, exitCode } = run(5, '--config config/bundlesize.json')
  t.is(exitCode, 0)
  t.snapshot(stdout)
})

test.serial('6. pass: multiple files, both smaller than limit', t => {
  const { stdout, exitCode } = run(6)
  t.is(exitCode, 0)
  t.snapshot(stdout)
})

test.serial('7. fail: multiple files, both bigger than limit', t => {
  const { stdout, exitCode } = run(7)
  t.is(exitCode, 1)
  t.snapshot(stdout)
})

test.serial('8. fail: multiple files, 1 smaller + 1 bigger than limit', t => {
  const { stdout, exitCode } = run(8)
  t.is(exitCode, 1)
  t.snapshot(stdout)
})

test.serial('9. pass: catch all js files', t => {
  const { stdout, exitCode } = run(9)
  t.is(exitCode, 0)
  t.snapshot(stdout)
})

test.serial('10. pass: match by fuzzy name', t => {
  const { stdout, exitCode } = run(10)
  t.is(exitCode, 0)
  t.snapshot(stdout)
})

test.serial('11. bug repro: bundlesize should dedup files', t => {
  const { stdout, exitCode } = run(11)
  t.is(exitCode, 0)
  t.snapshot(stdout)
})

test.serial(
  '12. deduped files with the same specificty should pick the latter one',
  t => {
    const { stdout, exitCode } = run(12)
    t.is(exitCode, 0)
    t.snapshot(stdout)
  }
)

test.serial(
  '13. dont dedup files with same path but different compression',
  t => {
    const { stdout, exitCode } = run(13)
    t.is(exitCode, 0)
    t.snapshot(stdout)
  }
)

test.serial(
  '14. pass: precompressed Brotli files should report the correct size',
  t => {
    const { stdout, exitCode } = run(14)
    t.is(exitCode, 0)
    t.snapshot(stdout)
  }
)

test.serial(
  '15. pass: precompressed Gzip files should report the correct size',
  t => {
    const { stdout, exitCode } = run(15)
    t.is(exitCode, 0)
    t.snapshot(stdout)
  }
)

test.serial(
  '16. pass: sum should be correct for multiple files',
  t => {
    const { stdout, exitCode } = run(16)
    t.is(exitCode, 0)
    t.snapshot(stdout)
  }
)

test.serial(
  '17. fail: sum multiple files, bigger than limit',
  t => {
    const { stdout, exitCode } = run(17)
    t.is(exitCode, 1)
    t.snapshot(stdout)
  }
)

test.serial(
  '18. pass: single file sum because greater specificity of other config',
  t => {
    const { stdout, exitCode } = run(18)
    t.is(exitCode, 0)
    t.snapshot(stdout)
  }
)

test.serial(
  '19. pass: duplicate file sum, should dedupe',
  t => {
    const { stdout, exitCode } = run(19)
    t.is(exitCode, 0)
    t.snapshot(stdout)
  }
)
test.serial(
  '20. pass: duplicate file sum, different compressions, no dedupe',
  t => {
    const { stdout, exitCode } = run(20)
    t.is(exitCode, 0)
    t.snapshot(stdout)
  }
)

test.serial(
  '21. pass: sum of a single file should still be same as if it was not a sum',
  t => {
    const { stdout, exitCode } = run(21)
    t.is(exitCode, 0)
    t.snapshot(stdout)
  }
)

test.serial(
  '22. pass: empty file matching should not throw an error',
  t => {
    const { stdout, exitCode } = run(22)
    t.is(exitCode, 0)
    t.snapshot(stdout)
  }
)

test.serial(
  '23. pass: summing multiple empty files that match a pattern should not throw an error',
  t => {
    const { stdout, exitCode } = run(23)
    t.is(exitCode, 0)
    t.snapshot(stdout)
  }
)

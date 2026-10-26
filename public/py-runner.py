# 정보 코딩 연습장: main.py를 표준 입력과 함께 돌리고 (출력, 오류, 걸린 시간)을 돌려준다. public/py-worker.js가 불러 쓴다.
import builtins
import io
import sys
import time
import traceback

OUTPUT_LIMIT = 2_000_000


class OutputLimit(Exception):
    pass


class _Out(io.StringIO):
    def write(self, text):
        if self.tell() + len(text) > OUTPUT_LIMIT:
            raise OutputLimit('출력이 너무 많아요 (200만 글자 초과)')
        return super().write(text)


def run_main(code, data):
    out = _Out()
    src = io.StringIO(data)
    saved = sys.stdout, sys.stderr, sys.stdin, builtins.input, sys.getrecursionlimit()

    def _input(prompt=''):
        if prompt:
            out.write(str(prompt))
        line = src.readline()
        if line == '':
            raise EOFError('EOF when reading a line')
        return line.rstrip('\n')

    sys.stdout = out
    sys.stderr = out
    sys.stdin = src
    builtins.input = _input
    error = None
    started = time.perf_counter()
    try:
        exec(compile(code, 'main.py', 'exec'), {'__name__': '__main__', '__builtins__': builtins})
    except SystemExit:
        pass
    except BaseException:
        error = traceback.format_exc()
    finally:
        seconds = time.perf_counter() - started
        sys.stdout, sys.stderr, sys.stdin, builtins.input, limit = saved
        sys.setrecursionlimit(limit)
    return out.getvalue(), error, seconds

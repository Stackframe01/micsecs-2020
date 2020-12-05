#!/usr/bin/env python3
import re
import json

if __name__ == "__main__":
    buf = {}
    with open("program.org", "r") as file:
        in_section = None
        for line in file.readlines():
            if in_section is None and not line.startswith('* ') or len(line) == 0:
                continue
            if line.startswith('* '):
                in_section = line[2:].strip()
                if in_section in buf:
                    raise RuntimeError("section name repeat: " + in_section)
                buf[in_section] = []
                continue
            if line.startswith('** '):
                title = line[3:].strip()
                title = re.sub(r"\[.+\] ", "", title)
                title = re.sub(r"<<(\d+)>> ", r"[\1] ", title)
                title = re.sub(r" :.*:", "", title)
                time = "long" if '[' in line else 'short'
                lang = 'en' if ':en:' in line else 'ru'
                buf[in_section].append({
                    'theme': title,
                    'time': time,
                    'lang': lang,
                })
                continue

            buf[in_section][-1]["authors"] = line.strip()

    for section, presentations in buf.items():
        print('')
        print(section)
        print('[' + ", ".join(map(json.dumps, presentations)) + ']')

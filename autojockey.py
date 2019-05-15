#!/usr/bin/python

import os
import subprocess
import time

folder_library_frag = './library_frag'
splash_wait = 2
frag_time = 2

def start_frag(frag):
    c = 'glslViewer -l ' + frag
    print(c)
    return subprocess.Popen(c.split())

def update_frag(filename):
    with open('_autojockey.frag', 'w+') as f:
        frag_file = open(folder_library_frag + '/' + filename, 'r')
        f.write(frag_file.read())


if __name__ == '__main__':
    print('HELLO AUTOJOCKEY');

    # Get files in library
    files_frag = [filename for filename in os.listdir(folder_library_frag) if filename.endswith('.frag')]

    # Load initial frag
    update_frag(files_frag[0])


    # Start process and play
    process = start_frag('_autojockey.frag')
    time.sleep(1)

    while True:
        frag_list = iter(files_frag)
        for f in frag_list:
            update_frag(f   )
            time.sleep(30)

    # End script
    process.terminate()

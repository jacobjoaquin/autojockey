#!/usr/bin/python

import os
import subprocess
import time

folder_library_frag = './library_frag'
splash_wait_time = 1
wait_time = 30

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

    # Get filenames in library
    files_frag = [f for f in os.listdir(folder_library_frag) if f.endswith('.frag')]

    # Load initial frag
    update_frag(files_frag[0])


    # Start process and play
    process = start_frag('_autojockey.frag')
    time.sleep(splash_wait_time)

    while True:
        frag_list = iter(files_frag)
        for f in frag_list:
            update_frag(f)
            time.sleep(wait_time)

    # End script
    process.terminate()

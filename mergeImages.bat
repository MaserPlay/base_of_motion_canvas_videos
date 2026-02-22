cd \output\project

ffmpeg -r 60 -f image2 -s 1920x1080 -i %%06d.png -i "..\..\audio\audio.mp3" -c:v libx264 -pix_fmt yuv420p -preset slow -c:a aac ..\output.mp4
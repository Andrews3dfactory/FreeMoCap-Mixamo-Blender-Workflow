# Troubleshooting

Start with the exact error shown by the app or command. Note Windows, FreeMoCap, Blender, and FFmpeg versions, and keep an unchanged copy of source videos and the FreeMoCap recording folder. Interface labels, output data, and supported exports change between releases; use the documentation matching your installed version.

- [FFmpeg cannot be found or convert a video](#ffmpeg-cannot-find-or-convert-a-video)
- [FreeMoCap cannot import video](#freemocap-cannot-import-video)
- [Calibration fails](#calibration-fails)
- [Tracking quality is poor](#tracking-quality-is-poor)
- [Processing output looks different](#processing-output-looks-different)
- [Blender export or import fails](#blender-export-or-import-fails)
- [Retargeting fails](#retargeting-fails)

## FFmpeg cannot find or convert a video

In Command Prompt, check that Windows can find FFmpeg:

```bat
where ffmpeg
ffmpeg -version
```

If `where` finds nothing, confirm FFmpeg is extracted and the PATH entry points to the directory containing `ffmpeg.exe` (for example, `C:\ffmpeg\bin`). Close and reopen Command Prompt after changing PATH. If needed, use **Edit the system environment variables → Environment Variables → Path** to add the folder.

Use quoted, full paths when folders or filenames contain spaces:

```bat
ffmpeg -i "C:\Users\YourName\Downloads\Your-File-Name.3gp" -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -c:a aac "C:\Users\YourName\Downloads\Your-File-Name_FreeMoCap.mp4"
```

Replace `YourName` and the filenames with the actual locations. This creates a converted copy; keep the original. If the original is supported by FreeMoCap, conversion may not be needed. Re-encoding cannot restore details missing from a low-resolution or heavily compressed source. If the file contains no audio, an audio-stream warning may be harmless for a video-only task.

Download Windows builds through a provider linked by the [official FFmpeg download page](https://ffmpeg.org/download.html); Windows builds are third-party packages.

## FreeMoCap cannot import video

- Verify the video opens in a media player and finished transferring from the phone.
- Use the original recording if the installed FreeMoCap version accepts it. Otherwise, convert a copy to MP4 using the command above.
- Follow the app's documented existing-video workflow. A **Playback → Import Videos** path or button may exist in a particular version, but is not guaranteed in every release.
- Confirm you selected the video (or session folder) expected by the app, and check its session list and full error output.
- For multi-camera work, use the correct synchronized session files and matching calibration. A single iPhone video is not automatically synchronized with other independently recorded clips.

See the [official FreeMoCap documentation](https://freemocap.github.io/documentation/index_md.html) for the UI corresponding to your version.

## Calibration fails

1. Check that the selected ChArUco layout and square/marker dimensions match the actual printed board.
2. Keep the board flat and rigid. Ensure it is clear and large enough in each camera view.
3. Keep cameras fixed after calibration and follow the current in-app prompts for moving and tilting the board.
4. Ground-plane calibration has additional requirements in some versions, including an initial period with the board flat, stationary, and visible to every camera. Follow the current [FreeMoCap calibration documentation](https://freemocap.github.io/documentation/index_md.html).
5. Do not assume example dimensions (such as 7 × 5 with 58 mm squares) are universal or choose a board merely because it looks similar.
6. A single-camera test may not need multi-camera calibration; check the chosen recording workflow.

If the app reports calibration failure or falls back to a default coordinate frame, save the full message and check the recording before relying on the result.

## Tracking quality is poor

- Prefer the original iPhone recording. Aim for 1080p or higher and 30–60 FPS when practical, with enough storage.
- Avoid heavy compression, very low resolution (for example 176 × 144), and low frame rates (for example 10 FPS). Converting does not restore lost detail.
- Use steady framing, even lighting, and a clean background; keep the entire body in frame and minimize motion blur and occlusion.
- Try a short, simple motion first.
- For multi-camera reconstruction, check that all views cover the capture volume and cameras did not move after calibration.

A distance of about 8–15 feet can be a starting point, not a fixed requirement; adjust for the space and ensure the person occupies enough of the frame.

## Processing output looks different

Output filenames and detectors vary by FreeMoCap version. Files such as `rtmpose_body_3d_xyz.npy`, `rtmpose_skeleton_3d.npy`, `rtmpose_left_hand_3d_xyz.npy`, `rtmpose_right_hand_3d_xyz.npy`, or `rtmpose_face_3d_xyz.npy` are examples from a reported workflow, not a required file set. Check the recording's output folder and the detector's documentation rather than treating a filename difference as a failure.

Likewise, button labels such as **Continue to Mocap Setup**, **Process Recording**, **Run Pipeline**, **Start Processing**, **Aggregation Complete**, or **100%** can differ across versions. Follow the visible workflow and wait for its completion status.

## Blender export or import fails

- Confirm Blender is installed and detected, and that your FreeMoCap version supports that Blender version.
- Check whether the detector used for processing is supported by the export. Upstream's current integrated exporter has documented MediaPipe-only output support; version behavior can change.
- Exported formats vary. Do not assume every release creates `.blend`, `.fbx`, or `.bvh`; check what the installed workflow actually produced.
- Open the `.blend` output directly if one was created. For BVH/FBX, use Blender's import menu for that file format and Blender version.
- If the scene opens without visible motion, inspect the timeline range, armature/skeleton, selected action, and output path.
- Save the complete FreeMoCap error and recording folder before retrying.

A raw skeleton data file is not necessarily a Blender scene or an animation ready for a Mixamo rig.

## Retargeting fails

- First verify that the source motion plays correctly in Blender.
- Confirm the character has the expected armature and that the chosen retargeting tool supports the source skeleton, target rig, and installed Blender version.
- Check bone mapping, rest/reference pose, forward/up axes, scale, and root motion.
- Rokoko Studio Live Blender Add-on is one possible retargeting option to investigate, not a guaranteed compatible choice. Check its current documentation and compatibility before installation.
- Inspect the whole animation for foot sliding, twisted limbs, root drift, and unexpected frame ranges. Bake/save the action using the chosen tool's documented steps.

## Still stuck?

Include a short reproduction, the exact error, and your Windows, FreeMoCap, Blender, and FFmpeg versions. Share only recordings you have permission to share; remove personal details from screenshots and logs.

[Back to the main guide](../README.md) · [Return to its troubleshooting section](../README.md#troubleshooting)

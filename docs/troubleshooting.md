# Troubleshooting

Practical checks for the [FreeMoCap → Mixamo → Blender guide](../README.md). Begin with the section matching your problem, then check the official documentation for the versions you installed. User interfaces and export features may change between releases.

## Table of contents

- [FFmpeg is not recognized](#ffmpeg-is-not-recognized)
- [FFmpeg cannot open the input file](#ffmpeg-cannot-open-the-input-file)
- [Converted video has no audio or looks different](#converted-video-has-no-audio-or-looks-different)
- [FreeMoCap cannot import a video](#freemocap-cannot-import-a-video)
- [Calibration or tracking is poor](#calibration-or-tracking-is-poor)
- [Processing is slow or stops](#processing-is-slow-or-stops)
- [No Blender-compatible export is available](#no-blender-compatible-export-is-available)
- [Blender retargeting looks wrong](#blender-retargeting-looks-wrong)
- [Still stuck?](#still-stuck)

## FFmpeg is not recognized

1. Close and reopen PowerShell or Windows Terminal after installing or editing PATH.
2. Check whether Windows can find FFmpeg:

```powershell
where.exe ffmpeg
```

3. If no path is printed, edit the **User Path** environment variable and add the `bin` directory containing `ffmpeg.exe` (for example, `C:\ffmpeg\bin`). Do not add the executable filename itself.
4. Open a fresh terminal and verify:

```powershell
ffmpeg -version
```

Avoid replacing the whole PATH value. Preserve existing entries. See the guide's [PATH instructions](../README.md#2-add-ffmpeg-to-path).

## FFmpeg cannot open the input file

- Confirm the input file exists and the path is spelled correctly.
- Put paths in double quotes, especially when they contain spaces:

```powershell
ffmpeg -i "C:\Videos\My clip.3gp" -c:v libx264 -pix_fmt yuv420p -c:a aac "C:\Videos\My clip.mp4"
```

- Make sure the output folder exists and you have permission to write there.
- Read the first error reported by FFmpeg; it often identifies a missing file, unsupported codec, or damaged input.

## Converted video has no audio or looks different

Some 3GP clips do not contain audio. If FFmpeg reports no audio stream, use `-an` to create a video-only MP4:

```powershell
ffmpeg -i "C:\Videos\walk.3gp" -c:v libx264 -pix_fmt yuv420p -an "C:\Videos\walk.mp4"
```

Re-encoding can change file size and image quality. Keep the original and inspect the converted clip before deleting or moving anything. FFmpeg conversion does not restore detail that was absent in the source.

## FreeMoCap cannot import a video

- Confirm the clip plays in a normal media player on the same computer.
- Confirm FreeMoCap supports the file/container and codec combination for your release. An `.mp4` extension alone does not guarantee codec compatibility.
- If appropriate, make a conversion copy with FFmpeg using the [conversion steps](../README.md#3-convert-3gp-to-mp4).
- Move a test copy to a local folder with a short, simple path and check file permissions.
- Reopen the session and follow the import procedure in the official documentation for your installed version.
- If the app shows an error, save the exact message and your FreeMoCap version when asking for help.

## Calibration or tracking is poor

- Follow the current FreeMoCap calibration procedure; confirm the target is printed at the required size, fully visible, and not blurred or obscured.
- Improve lighting and avoid glare, flicker, deep shadows, and backlighting.
- Stabilize the phone and frame the full body, leaving space around hands and feet.
- Avoid loose clothing or backgrounds that hide the subject. Keep the action within the calibrated capture area.
- Test with a short, simple motion before recording a long performance.
- Review the 2D detections and calibration results, if provided by your FreeMoCap release, before interpreting the 3D output.

## Processing is slow or stops

- Processing time depends on video duration, resolution, camera count, hardware, and selected processing method.
- Confirm the computer has adequate free disk space and is not sleeping during the run.
- Try a short clip first. If that works, process the original in shorter segments only if the documented workflow supports it.
- Close unnecessary applications, and review the app's logs or error output for the first reported failure.
- Do not repeatedly launch processing against the same session if it may still be running.

## No Blender-compatible export is available

Export capabilities may depend on the FreeMoCap version and tracking backend. Check the official docs for the exact release and confirm which output formats are supported by the selected processing route. Do not rename a data file to a different extension and assume it has been converted. If there is no documented compatible route, report the FreeMoCap version, tracking mode, and available export choices to the project maintainers.

## Blender retargeting looks wrong

- Verify that the imported motion is animated before attempting retargeting.
- Check the source and target units, scale, up-axis, and forward direction against the export/import documentation.
- Confirm that the selected target is a deform rig and the retarget tool supports that rig and Blender version.
- Review the source and target rest poses; a mismatch can cause twisted limbs or offsets.
- Inspect bone mapping, particularly hips/root, spine, shoulders, hands, and feet. Names and hierarchies are not universal.
- Test on a short frame range and inspect from front and side views. Check foot contact and root movement before baking the full animation.
- Save a copy before applying transforms, baking animation, or changing the rig.

## Still stuck?

When opening an issue, include:

- Windows version and FreeMoCap, Blender, and FFmpeg versions.
- The exact step that fails and a concise copy of the error text.
- Input video format and codec, without sharing private footage.
- The export format and retargeting tool, if the problem occurs in Blender.
- A screenshot with personal or sensitive information removed.

Return to the [main workflow guide](../README.md#troubleshooting).

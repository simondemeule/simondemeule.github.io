function View() {
    let view = this

    let canvas = this.canvas
    let context = this.context

    this.lastWidth = 0
    this.lastHeight = 0

    this.parallaxStrengthBackground = 0.1
    this.parallaxStrengthForeground = 0.3
    this.parallaxFactor = 0

    this.isReadyContext = false
    this.isReadyImageBackground = false
    this.isReadyImageForeground = false
    this.isReadyImageBackgroundTemp = false
    this.isReadyImageForegroundTemp = false

    this.isDirty = true

    // initialize
    this.initialize = function() {
        view.createContext()

        view.imageBackground = new Image()
        view.imageForeground = new Image()
        view.imageBackgroundTemp = new Image()
        view.imageForegroundTemp = new Image()

        view.imageBackground.onload = function() {
            view.isReadyImageBackground = true
            view.isDirty = true
        }
        view.imageForeground.onload = function() {
            view.isReadyImageForeground = true
            view.isDirty = true
        }
        view.imageBackgroundTemp.onload = function() {
            view.isReadyImageBackgroundTemp = true
            view.isDirty = true
        }
        view.imageForegroundTemp.onload = function() {
            view.isReadyImageForegroundTemp = true
            view.isDirty = true
        }

        view.imageBackground.src = "background.jpg"
        view.imageForeground.src = "foreground.jpg"
        /*
        view.imageBackgroundTemp.src = "backdropTemp.png"
        view.imageForegroundTemp.src = "backdropTempInverted.png"
        */
        view.imageBackgroundTemp.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAAAuCAIAAAAEIshXAAABN2lDQ1BBZG9iZSBSR0IgKDE5OTgpAAAokZWPv0rDUBSHvxtFxaFWCOLgcCdRUGzVwYxJW4ogWKtDkq1JQ5ViEm6uf/oQjm4dXNx9AidHwUHxCXwDxamDQ4QMBYvf9J3fORzOAaNi152GUYbzWKt205Gu58vZF2aYAoBOmKV2q3UAECdxxBjf7wiA10277jTG+38yH6ZKAyNguxtlIYgK0L/SqQYxBMygn2oQD4CpTto1EE9AqZf7G1AKcv8ASsr1fBBfgNlzPR+MOcAMcl8BTB1da4Bakg7UWe9Uy6plWdLuJkEkjweZjs4zuR+HiUoT1dFRF8jvA2AxH2w3HblWtay99X/+PRHX82Vun0cIQCw9F1lBeKEuf1UYO5PrYsdwGQ7vYXpUZLs3cLcBC7dFtlqF8hY8Dn8AwMZP/fNTP8gAAAAJcEhZcwAALiMAAC4jAXilP3YAABuTaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0NSA3OS4xNjM0OTksIDIwMTgvMDgvMTMtMTY6NDA6MjIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6Y3JzPSJodHRwOi8vbnMuYWRvYmUuY29tL2NhbWVyYS1yYXctc2V0dGluZ3MvMS4wLyIgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIiB4bXA6Q3JlYXRvclRvb2w9IklyZmFuVmlldyIgeG1wOlJhdGluZz0iMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0wMS0zMFQxNDoyNTo0Mi0wNTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjEtMDEtMzBUMTQ6MjU6NDItMDU6MDAiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAxLTMxVDE4OjE5OjM1IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6OGE3MGI0YTItNTBjOS1lMTQwLTk2ZTktMzkwOTE3MjRjY2Q1IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9IjhBMzJFMEExMUE0NjFEMTZDNDc1NzVCRjY4Mzk3QkJBIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjg2YWNmNWEwLTRmMDQtNDE1Ni05YTU1LTZlODNlNWRhYzdjNiIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpMZWdhY3lJUFRDRGlnZXN0PSJFOEYxNUNGMzJGQzExOEExQTI3QjY3QURDNTY0RDVCQSIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9IkFkb2JlIFJHQiAoMTk5OCkiIGNyczpWZXJzaW9uPSIxMS4zLjEiIGNyczpQcm9jZXNzVmVyc2lvbj0iMTEuMCIgY3JzOldoaXRlQmFsYW5jZT0iQXMgU2hvdCIgY3JzOkluY3JlbWVudGFsVGVtcGVyYXR1cmU9IjAiIGNyczpJbmNyZW1lbnRhbFRpbnQ9IjAiIGNyczpTYXR1cmF0aW9uPSIwIiBjcnM6U2hhcnBuZXNzPSIwIiBjcnM6THVtaW5hbmNlU21vb3RoaW5nPSIwIiBjcnM6Q29sb3JOb2lzZVJlZHVjdGlvbj0iMCIgY3JzOlZpZ25ldHRlQW1vdW50PSIwIiBjcnM6U2hhZG93VGludD0iMCIgY3JzOlJlZEh1ZT0iMCIgY3JzOlJlZFNhdHVyYXRpb249IjAiIGNyczpHcmVlbkh1ZT0iMCIgY3JzOkdyZWVuU2F0dXJhdGlvbj0iMCIgY3JzOkJsdWVIdWU9IjAiIGNyczpCbHVlU2F0dXJhdGlvbj0iMCIgY3JzOlZpYnJhbmNlPSIwIiBjcnM6SHVlQWRqdXN0bWVudFJlZD0iMCIgY3JzOkh1ZUFkanVzdG1lbnRPcmFuZ2U9IjAiIGNyczpIdWVBZGp1c3RtZW50WWVsbG93PSIwIiBjcnM6SHVlQWRqdXN0bWVudEdyZWVuPSIwIiBjcnM6SHVlQWRqdXN0bWVudEFxdWE9IjAiIGNyczpIdWVBZGp1c3RtZW50Qmx1ZT0iMCIgY3JzOkh1ZUFkanVzdG1lbnRQdXJwbGU9IjAiIGNyczpIdWVBZGp1c3RtZW50TWFnZW50YT0iMCIgY3JzOlNhdHVyYXRpb25BZGp1c3RtZW50UmVkPSIwIiBjcnM6U2F0dXJhdGlvbkFkanVzdG1lbnRPcmFuZ2U9IjAiIGNyczpTYXR1cmF0aW9uQWRqdXN0bWVudFllbGxvdz0iMCIgY3JzOlNhdHVyYXRpb25BZGp1c3RtZW50R3JlZW49IjAiIGNyczpTYXR1cmF0aW9uQWRqdXN0bWVudEFxdWE9IjAiIGNyczpTYXR1cmF0aW9uQWRqdXN0bWVudEJsdWU9IjAiIGNyczpTYXR1cmF0aW9uQWRqdXN0bWVudFB1cnBsZT0iMCIgY3JzOlNhdHVyYXRpb25BZGp1c3RtZW50TWFnZW50YT0iMCIgY3JzOkx1bWluYW5jZUFkanVzdG1lbnRSZWQ9IjAiIGNyczpMdW1pbmFuY2VBZGp1c3RtZW50T3JhbmdlPSIwIiBjcnM6THVtaW5hbmNlQWRqdXN0bWVudFllbGxvdz0iMCIgY3JzOkx1bWluYW5jZUFkanVzdG1lbnRHcmVlbj0iMCIgY3JzOkx1bWluYW5jZUFkanVzdG1lbnRBcXVhPSIwIiBjcnM6THVtaW5hbmNlQWRqdXN0bWVudEJsdWU9IjAiIGNyczpMdW1pbmFuY2VBZGp1c3RtZW50UHVycGxlPSIwIiBjcnM6THVtaW5hbmNlQWRqdXN0bWVudE1hZ2VudGE9IjAiIGNyczpTcGxpdFRvbmluZ1NoYWRvd0h1ZT0iMCIgY3JzOlNwbGl0VG9uaW5nU2hhZG93U2F0dXJhdGlvbj0iMCIgY3JzOlNwbGl0VG9uaW5nSGlnaGxpZ2h0SHVlPSIwIiBjcnM6U3BsaXRUb25pbmdIaWdobGlnaHRTYXR1cmF0aW9uPSIwIiBjcnM6U3BsaXRUb25pbmdCYWxhbmNlPSIwIiBjcnM6UGFyYW1ldHJpY1NoYWRvd3M9IjAiIGNyczpQYXJhbWV0cmljRGFya3M9IjAiIGNyczpQYXJhbWV0cmljTGlnaHRzPSIwIiBjcnM6UGFyYW1ldHJpY0hpZ2hsaWdodHM9IjAiIGNyczpQYXJhbWV0cmljU2hhZG93U3BsaXQ9IjI1IiBjcnM6UGFyYW1ldHJpY01pZHRvbmVTcGxpdD0iNTAiIGNyczpQYXJhbWV0cmljSGlnaGxpZ2h0U3BsaXQ9Ijc1IiBjcnM6U2hhcnBlblJhZGl1cz0iKzEuMCIgY3JzOlNoYXJwZW5EZXRhaWw9IjI1IiBjcnM6U2hhcnBlbkVkZ2VNYXNraW5nPSIwIiBjcnM6UG9zdENyb3BWaWduZXR0ZUFtb3VudD0iMCIgY3JzOkdyYWluQW1vdW50PSIwIiBjcnM6TGVuc1Byb2ZpbGVFbmFibGU9IjAiIGNyczpMZW5zTWFudWFsRGlzdG9ydGlvbkFtb3VudD0iMCIgY3JzOlBlcnNwZWN0aXZlVmVydGljYWw9IjAiIGNyczpQZXJzcGVjdGl2ZUhvcml6b250YWw9IjAiIGNyczpQZXJzcGVjdGl2ZVJvdGF0ZT0iMC4wIiBjcnM6UGVyc3BlY3RpdmVTY2FsZT0iMTAwIiBjcnM6UGVyc3BlY3RpdmVBc3BlY3Q9IjAiIGNyczpQZXJzcGVjdGl2ZVVwcmlnaHQ9IjAiIGNyczpQZXJzcGVjdGl2ZVg9IjAuMDAiIGNyczpQZXJzcGVjdGl2ZVk9IjAuMDAiIGNyczpBdXRvTGF0ZXJhbENBPSIwIiBjcnM6RXhwb3N1cmUyMDEyPSIwLjAwIiBjcnM6Q29udHJhc3QyMDEyPSIwIiBjcnM6SGlnaGxpZ2h0czIwMTI9IjAiIGNyczpTaGFkb3dzMjAxMj0iMCIgY3JzOldoaXRlczIwMTI9IjAiIGNyczpCbGFja3MyMDEyPSIwIiBjcnM6Q2xhcml0eTIwMTI9IjAiIGNyczpEZWZyaW5nZVB1cnBsZUFtb3VudD0iMCIgY3JzOkRlZnJpbmdlUHVycGxlSHVlTG89IjMwIiBjcnM6RGVmcmluZ2VQdXJwbGVIdWVIaT0iNzAiIGNyczpEZWZyaW5nZUdyZWVuQW1vdW50PSIwIiBjcnM6RGVmcmluZ2VHcmVlbkh1ZUxvPSI0MCIgY3JzOkRlZnJpbmdlR3JlZW5IdWVIaT0iNjAiIGNyczpEZWhhemU9IjAiIGNyczpUZXh0dXJlPSIwIiBjcnM6VG9uZU1hcFN0cmVuZ3RoPSIwIiBjcnM6Q29udmVydFRvR3JheXNjYWxlPSJGYWxzZSIgY3JzOk92ZXJyaWRlTG9va1ZpZ25ldHRlPSJGYWxzZSIgY3JzOlRvbmVDdXJ2ZU5hbWU9IkxpbmVhciIgY3JzOlRvbmVDdXJ2ZU5hbWUyMDEyPSJMaW5lYXIiIGNyczpDYW1lcmFQcm9maWxlPSJFbWJlZGRlZCIgY3JzOkNhbWVyYVByb2ZpbGVEaWdlc3Q9IjU0NjUwQTM0MUI1QjVDQ0FFODQ0MkQwQjQzQTkyQkNFIiBjcnM6TGVuc1Byb2ZpbGVTZXR1cD0iTGVuc0RlZmF1bHRzIiBjcnM6VXByaWdodFZlcnNpb249IjE1MTM4ODE2MCIgY3JzOlVwcmlnaHRDZW50ZXJNb2RlPSIwIiBjcnM6VXByaWdodENlbnRlck5vcm1YPSIwLjUiIGNyczpVcHJpZ2h0Q2VudGVyTm9ybVk9IjAuNSIgY3JzOlVwcmlnaHRGb2NhbE1vZGU9IjAiIGNyczpVcHJpZ2h0Rm9jYWxMZW5ndGgzNW1tPSIzNSIgY3JzOlVwcmlnaHRQcmV2aWV3PSJGYWxzZSIgY3JzOlVwcmlnaHRUcmFuc2Zvcm1Db3VudD0iNiIgY3JzOlVwcmlnaHRGb3VyU2VnbWVudHNDb3VudD0iMCIgY3JzOkhhc1NldHRpbmdzPSJUcnVlIiBjcnM6SGFzQ3JvcD0iRmFsc2UiIGNyczpBbHJlYWR5QXBwbGllZD0iVHJ1ZSIgY3JzOlJhd0ZpbGVOYW1lPSJiYWNrZ3JvdW5kU291cmNlLnRpZiIgdGlmZjpYUmVzb2x1dGlvbj0iMzAwLzEiIHRpZmY6WVJlc29sdXRpb249IjMwMC8xIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiBleGlmOkV4aWZWZXJzaW9uPSIwMjMxIiBleGlmOkNvbG9yU3BhY2U9IjY1NTM1IiBleGlmOlBpeGVsWERpbWVuc2lvbj0iMzYwMCIgZXhpZjpQaXhlbFlEaW1lbnNpb249IjIzMDAiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmMjJhYTlmNy05MzczLTRlOTYtOGYzZS03YmQ3Mjc3ZTgzNmIiIHN0RXZ0OndoZW49IjIwMjAtMDktMjdUMTU6NTAtMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDYW1lcmEgUmF3IDExLjMuMSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iL21ldGFkYXRhIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2NzkyNWExZC1kNjVjLTQ3NmQtOGFiYy04NDBkODVmMjZjNjMiIHN0RXZ0OndoZW49IjIwMjEtMDEtMjVUMTI6NTg6MzktMDU6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDYW1lcmEgUmF3IDExLjMuMSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iL21ldGFkYXRhIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDplN2Y4OGE1Yy01MTVmLTQ3MjUtYjg2OS04MDcyNGMxYTM3OWMiIHN0RXZ0OndoZW49IjIwMjEtMDEtMzBUMTQ6MTU6MDItMDU6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDYW1lcmEgUmF3IDExLjMuMSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NmQwOTkwNTMtYzI0Ni00ODFhLWE5MDAtYWFiMGNiZjhmMjJhIiBzdEV2dDp3aGVuPSIyMDIxLTAxLTMwVDE0OjIxOjI5LTA1OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGltYWdlL3RpZmYgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBpbWFnZS90aWZmIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6Zjk4MmMxZjktODFmZC00MDc5LTgwZmQtOTc0M2I2ODZhNzkwIiBzdEV2dDp3aGVuPSIyMDIxLTAxLTMwVDE0OjIxOjI5LTA1OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ODZhY2Y1YTAtNGYwNC00MTU2LTlhNTUtNmU4M2U1ZGFjN2M2IiBzdEV2dDp3aGVuPSIyMDIxLTAxLTMwVDE0OjI1OjQyLTA1OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NmQwOTkwNTMtYzI0Ni00ODFhLWE5MDAtYWFiMGNiZjhmMjJhIiBzdFJlZjpkb2N1bWVudElEPSI4QTMyRTBBMTFBNDYxRDE2QzQ3NTc1QkY2ODM5N0JCQSIgc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPSI4QTMyRTBBMTFBNDYxRDE2QzQ3NTc1QkY2ODM5N0JCQSIvPiA8Y3JzOlRvbmVDdXJ2ZT4gPHJkZjpTZXE+IDxyZGY6bGk+MCwgMDwvcmRmOmxpPiA8cmRmOmxpPjI1NSwgMjU1PC9yZGY6bGk+IDwvcmRmOlNlcT4gPC9jcnM6VG9uZUN1cnZlPiA8Y3JzOlRvbmVDdXJ2ZVJlZD4gPHJkZjpTZXE+IDxyZGY6bGk+MCwgMDwvcmRmOmxpPiA8cmRmOmxpPjI1NSwgMjU1PC9yZGY6bGk+IDwvcmRmOlNlcT4gPC9jcnM6VG9uZUN1cnZlUmVkPiA8Y3JzOlRvbmVDdXJ2ZUdyZWVuPiA8cmRmOlNlcT4gPHJkZjpsaT4wLCAwPC9yZGY6bGk+IDxyZGY6bGk+MjU1LCAyNTU8L3JkZjpsaT4gPC9yZGY6U2VxPiA8L2NyczpUb25lQ3VydmVHcmVlbj4gPGNyczpUb25lQ3VydmVCbHVlPiA8cmRmOlNlcT4gPHJkZjpsaT4wLCAwPC9yZGY6bGk+IDxyZGY6bGk+MjU1LCAyNTU8L3JkZjpsaT4gPC9yZGY6U2VxPiA8L2NyczpUb25lQ3VydmVCbHVlPiA8Y3JzOlRvbmVDdXJ2ZVBWMjAxMj4gPHJkZjpTZXE+IDxyZGY6bGk+MCwgMDwvcmRmOmxpPiA8cmRmOmxpPjI1NSwgMjU1PC9yZGY6bGk+IDwvcmRmOlNlcT4gPC9jcnM6VG9uZUN1cnZlUFYyMDEyPiA8Y3JzOlRvbmVDdXJ2ZVBWMjAxMlJlZD4gPHJkZjpTZXE+IDxyZGY6bGk+MCwgMDwvcmRmOmxpPiA8cmRmOmxpPjI1NSwgMjU1PC9yZGY6bGk+IDwvcmRmOlNlcT4gPC9jcnM6VG9uZUN1cnZlUFYyMDEyUmVkPiA8Y3JzOlRvbmVDdXJ2ZVBWMjAxMkdyZWVuPiA8cmRmOlNlcT4gPHJkZjpsaT4wLCAwPC9yZGY6bGk+IDxyZGY6bGk+MjU1LCAyNTU8L3JkZjpsaT4gPC9yZGY6U2VxPiA8L2NyczpUb25lQ3VydmVQVjIwMTJHcmVlbj4gPGNyczpUb25lQ3VydmVQVjIwMTJCbHVlPiA8cmRmOlNlcT4gPHJkZjpsaT4wLCAwPC9yZGY6bGk+IDxyZGY6bGk+MjU1LCAyNTU8L3JkZjpsaT4gPC9yZGY6U2VxPiA8L2NyczpUb25lQ3VydmVQVjIwMTJCbHVlPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pp7mfhoAAAsuSURBVGiBjVrbcps6FJVAXF2nSey0D/2B/v9/9BPaaWc6nTRO7GADQgKk87DsVRnsnPDgIbaQ9tqXtS9ENk0jhBBCWGufnp42m41zru/7ruvGcRzH0TnnvZdSxnHsvcdi3HjvcSOlxBrnHBfgPo7jOI6VUkqpKI7iKI6iKIoiPOK9H8ex7/thGKy1XdfVdV3X9fPz89+/f3e7Xd/3ZVmu1+v7+/vFYqGUEkIMw9B1Xdd1xhhrbdu2VVXt93ut9TAMkEcJIYQU4zDWdf3y8mKtdc5Za4dh6Pveez8Mg5QyiiLnnJRSBJdzjkj4DcSF3ACAe6yMZAQw2BD3zjkoEYdqrbuugyRKqTzPsyxL0zRN0yRJIDcWW2u5M2XD6UoI4Z03xmw2G631OI4Ag4tCCCHwSaEBA5/clPid/3cY4dHmNBfEwkVgxpi2bfu+l1IqpYjqaPYogoRxHFMSHIFPCKmEEOM47vf73W5nrYWgwzj0fQ9dUvRxHEOL0TIhbAodiQgWw/E8b+K0VBD0aIwxxrRt0zRN13Xee6UUnDmKIqCKoihJkr7v6dJQWZqmfd8DjnNOOee01k9PT1prHN/3/dAP0B+kh6YhUIgt9LfJlzwPx4euEnosTsEnwqau66ra13VtjEmSJDQFt4W+iIpo8zyHf1pr1TAMr6+vLy8vcDkeRj+c24oACImn8qeJe0xMTYPDA0EexhgAa9u267q+75Mkobl4Io8IrziOkyTx3lMXqm3bP3/+WGvpr2AOmmsSlwBPSqAxw8DlI/x+AimMMcADNq110zRN0xhjaIo4jrkDVMy4mgRYmqb0IFVVVV0f+r7H89CftZYBNgkPgKERwBaMsYnTnqx1doWhFfIHmUNrba1N0zRERX7m+lBfITl577MsU1LKu7t777egRGwNog9Ze06GSZLAS6k8LiDmuQvRkYAKrkhKRCrD6eADMCHWw7B4CpFJrqfd8E0cx2q5XMZxnGXZ09PT4+Mjsp5zjrFxpO9AQ9xCKTWOo1IKCScM7nkcRpFEaNBW4pTHCQwX/I1Ej9wFb2I2wnpmQmg/iiIwRRzHqizLJEnwvLX258+fWmshBLiVWplEC+sJ6DWO43EcyVTx6QoD3XtgE7QqcwnrG5KkECLLsizL8jyH0fBgiA1hifXMpfAd770C8yil4FpN0/z69XMYjnaAe2C7iREgOlIKN4Ha0jQNXRGqobtiH+bGicWQP6FrqBsOOWHsEBh4DguoLBXS8Wq1+vr1q/f+9+/f+Bme2XUdAjfkDFg8SRL4DLGBmrgm9MaQJxk2NBpkhR6LokiSBJvjhu7D9AAV4J40RudSNEKaplLKT58+tW17OBzatkVuqev6cDgQGMOMwNLTBVRZlhVFQZ7EI1A5DUWi5z29AyUiPOLoFyqGK0Jo2spay/IIxic255wKYsBD9/f397e3t6ia+75v23a3283rKdQ4BMMLqKAsKA9O7oMqUZwKaAYVWRGUQBKSUkYyCqk8jCvYkImUWjtaLAxxCFoUBX1aa13XNX0m3ALn4ZE8z/M8L4piuVzyvLCLgQVEkBgp3yRsyCWh31Kb9OGQEsUpd1PIf8BCa7CaHMexrmtya7gjD5ZSIgwAzBjDcow2gaPKoOpDUrLnV4iQpEXqYsQy3phgWE4cHd47FeIhYWitIRPKbVbipOYJQq014i3LMuT308//WIGFH4Ad434cyE94kKgQQrgYnyEtR6crzNRMj2cWc85Za19eXowxOLhtW2OMf/NiTEMLQPXPJgtblmWe56RNOAwtAz2yueSXbdu2bYs8hviHE03q4LCXDcNYeeGlkEx/bdtut1vI1Pd90zTu/AohifMyl3TM3ay1sEZRFEhKgIetWEMBg9YaeiGwuq7zPEe0027+lAz9aWBBlmKwCSEUUUGUuq4BBkc2TUNDT0JLCOHFtBzhJrAhqHWxWMBoWZaFZQQWoF9umgbY2MLUdb1YLLIsk1IiSpFgJkxIQpLB/OLMFQGmqipmCfRFZJ65+3l3Biw0XdM0kA+QFosFaBMZj4UPvFdrfTgcOI2BJDSXcw4GB0jaxAfV8IRFj8BoLmPMdrtlz7ff71lEhw+H7nfRLWEN+LPWOk3TqqqKomCuY2ZDMwHXwDgAQiPNvL6+4r4sy6IoEKikR6UUbe5OozQKcyzJ4WmoOYBw4ocXaWMCZm43MJDWGq07aBN2Q4lMyRBUKDvEKeVgNIipAfwZO8DsPAWzKhFkf3mcUnmPjbbbbdM0YUBPAmyOkI+HNgzvUcgJIbquY7UNYFAo6JF5jI8750DI8CAsK8uS+ZBFNn4Kg01KqXyQvh4fH3EAWnSa+EJ0XTfd/OIyNrJscHyQLdysOQI2ZEJ8A0NBNc45Vv3GGCwAZoUUAdCvr68vz8/DMICd9vs9M9I7vXFisYs3/hTx19ZM9vGnMgiTU1Q5qGOAE80E8MvTAGscR4WTjDGPj4+HugYZIoegDxfBcOIisIuSTbx0/uvke3k+BZvogrNApRRoFhbDjRCCjRXMlSSJcuM4jOPhcPj9+zfyI4AxNcvzidJ7nPAaGMbGxPEm3dq1DdF85HlelEWiEuyQ57kQApKTLcdxVJ0xfd8/Pj5uNhvM+BFgqEG5KcnqIqq5KKG+cUkpQdlQMJl98vgbzhlFEYBlaYYponMuSRLWSSJoN9XT05O19vv37+gsMfpCJ+bOR1yhd71hrmtiJUmyXq+Xy+UwDHVdV1WFdHLtKXI3UdHNcEHdQMhJCaNGffv2bRzHX79+sZZBjcNGILzCClq8z1z8c7lcfvnypSzLvu/RjMIp3qMa+Go4QUK2iKIoklFYdvBT/fjxA21CHMfMJyAZH8xeJo9dxDZpscPFcRyvVqvPnz+XZdl1HSZi+/0emeoisDlOxM9kai+kCLMfU4iCd+JvZLpJDzbX4jWLXQx6fFkUBV7eocZ3zlVVxWRz8dn5hZaPzRj0JU5dxWSx4rQxBAbWEm+y8NvSTBzp5uZmvV4XRYFEhBqfm0xO4VOT46LzlyxsXiYhcxwfcfzP9gnMcVHo/zXRZLE/DXPwolWgtOutMYZvwK7tE55CVw/BMHlcVIriOrZ9IGIXTHxk8CbhPZAmC8qyXK1WeZ4jz5rO7Pf77XartX7nPsDGSc7kKfB7iOo49McPSGIExuQzF/T94Y4wuL29/fjxI9pQvAHb7Xbb7XbC9W9vJc9fCYhgbgmuR7yBYMqyPFbKw/krHLY3byCZ0/EclRACg8rlcpkkCRwBfIg3BNdgzL9EgPElIId5QgiMjemcWZaVZXl0RQ7A0JzPM9gkXV7U6ByVlPLDhw8PDw/L5TJNU2utUkoI33Xd/Ig3Lnl+sTPwp+qcPQvKrizLFHiCnSyqyTBw37abuB6B3vskSe7u7u7u7oqiwAwniiLvxTVyurhPeAqihnPOUOBjG3Z6n6Y47oK5kJrJ9SGqudHCaZE45zHcFEWxWq1ubm74/kVKiWD+X/e+tsCd/g0FM7XD4dB1HYSBozrntNYKWQtJmf824mb/qzKHJ4MX6hfNpZS6vb1dr9dlWcJcII/X11eIclEpb1ywVdu2fHdXVdVutwO7MgjRzioU/JwW4f0Fj5ykwvdIwAV5nq9Wq/v7e0yXSBv4/583Nrx4BB7Hex8O8LbbLd7CCiFQInPioPDqGahYIjLTX5Oe5rrmh3EcL5fLh4eHm5sbzqQwBdvv92EumhPPNXM1TbPZbNg+D8Pw/Py82WzQO/NlHTZUICj4IQr8cJT1Bqr5fShWlmXr9frh4WGxWICLAayqqtAPJzcX/R8LhmHAs6yqhmHA9Ak2QC8Ddliv1/8B5V7G/aJKtsIAAAAASUVORK5CYII="
        view.imageForegroundTemp.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAAAuCAIAAAAEIshXAAABN2lDQ1BBZG9iZSBSR0IgKDE5OTgpAAAokZWPv0rDUBSHvxtFxaFWCOLgcCdRUGzVwYxJW4ogWKtDkq1JQ5ViEm6uf/oQjm4dXNx9AidHwUHxCXwDxamDQ4QMBYvf9J3fORzOAaNi152GUYbzWKt205Gu58vZF2aYAoBOmKV2q3UAECdxxBjf7wiA10277jTG+38yH6ZKAyNguxtlIYgK0L/SqQYxBMygn2oQD4CpTto1EE9AqZf7G1AKcv8ASsr1fBBfgNlzPR+MOcAMcl8BTB1da4Bakg7UWe9Uy6plWdLuJkEkjweZjs4zuR+HiUoT1dFRF8jvA2AxH2w3HblWtay99X/+PRHX82Vun0cIQCw9F1lBeKEuf1UYO5PrYsdwGQ7vYXpUZLs3cLcBC7dFtlqF8hY8Dn8AwMZP/fNTP8gAAAAJcEhZcwAALiMAAC4jAXilP3YAAButaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0NSA3OS4xNjM0OTksIDIwMTgvMDgvMTMtMTY6NDA6MjIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6Y3JzPSJodHRwOi8vbnMuYWRvYmUuY29tL2NhbWVyYS1yYXctc2V0dGluZ3MvMS4wLyIgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIiB4bXA6Q3JlYXRvclRvb2w9IklyZmFuVmlldyIgeG1wOlJhdGluZz0iMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0wMS0zMFQxNDoyNDo0MS0wNTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjEtMDEtMzBUMTQ6MjQ6NDEtMDU6MDAiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAxLTMxVDE4OjE5OjM1IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6YWI5NWYyNWQtMjNjOS00YzQ0LWExOWYtMzg5Nzg0YWNjM2UwIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9IjhBMzJFMEExMUE0NjFEMTZDNDc1NzVCRjY4Mzk3QkJBIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjlkMjUxMmEwLTY3NzItNDYzNi1iZmY0LWI5YjEyZWEyOTRjNCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpMZWdhY3lJUFRDRGlnZXN0PSJFOEYxNUNGMzJGQzExOEExQTI3QjY3QURDNTY0RDVCQSIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9IkFkb2JlIFJHQiAoMTk5OCkiIGNyczpWZXJzaW9uPSIxMS4zLjEiIGNyczpQcm9jZXNzVmVyc2lvbj0iMTEuMCIgY3JzOldoaXRlQmFsYW5jZT0iQXMgU2hvdCIgY3JzOkluY3JlbWVudGFsVGVtcGVyYXR1cmU9IjAiIGNyczpJbmNyZW1lbnRhbFRpbnQ9IjAiIGNyczpTYXR1cmF0aW9uPSIwIiBjcnM6U2hhcnBuZXNzPSIwIiBjcnM6THVtaW5hbmNlU21vb3RoaW5nPSIwIiBjcnM6Q29sb3JOb2lzZVJlZHVjdGlvbj0iMCIgY3JzOlZpZ25ldHRlQW1vdW50PSIwIiBjcnM6U2hhZG93VGludD0iMCIgY3JzOlJlZEh1ZT0iMCIgY3JzOlJlZFNhdHVyYXRpb249IjAiIGNyczpHcmVlbkh1ZT0iMCIgY3JzOkdyZWVuU2F0dXJhdGlvbj0iMCIgY3JzOkJsdWVIdWU9IjAiIGNyczpCbHVlU2F0dXJhdGlvbj0iMCIgY3JzOlZpYnJhbmNlPSIwIiBjcnM6SHVlQWRqdXN0bWVudFJlZD0iMCIgY3JzOkh1ZUFkanVzdG1lbnRPcmFuZ2U9IjAiIGNyczpIdWVBZGp1c3RtZW50WWVsbG93PSIwIiBjcnM6SHVlQWRqdXN0bWVudEdyZWVuPSIwIiBjcnM6SHVlQWRqdXN0bWVudEFxdWE9IjAiIGNyczpIdWVBZGp1c3RtZW50Qmx1ZT0iMCIgY3JzOkh1ZUFkanVzdG1lbnRQdXJwbGU9IjAiIGNyczpIdWVBZGp1c3RtZW50TWFnZW50YT0iMCIgY3JzOlNhdHVyYXRpb25BZGp1c3RtZW50UmVkPSIwIiBjcnM6U2F0dXJhdGlvbkFkanVzdG1lbnRPcmFuZ2U9IjAiIGNyczpTYXR1cmF0aW9uQWRqdXN0bWVudFllbGxvdz0iMCIgY3JzOlNhdHVyYXRpb25BZGp1c3RtZW50R3JlZW49IjAiIGNyczpTYXR1cmF0aW9uQWRqdXN0bWVudEFxdWE9IjAiIGNyczpTYXR1cmF0aW9uQWRqdXN0bWVudEJsdWU9IjAiIGNyczpTYXR1cmF0aW9uQWRqdXN0bWVudFB1cnBsZT0iMCIgY3JzOlNhdHVyYXRpb25BZGp1c3RtZW50TWFnZW50YT0iMCIgY3JzOkx1bWluYW5jZUFkanVzdG1lbnRSZWQ9IjAiIGNyczpMdW1pbmFuY2VBZGp1c3RtZW50T3JhbmdlPSIwIiBjcnM6THVtaW5hbmNlQWRqdXN0bWVudFllbGxvdz0iMCIgY3JzOkx1bWluYW5jZUFkanVzdG1lbnRHcmVlbj0iMCIgY3JzOkx1bWluYW5jZUFkanVzdG1lbnRBcXVhPSIwIiBjcnM6THVtaW5hbmNlQWRqdXN0bWVudEJsdWU9IjAiIGNyczpMdW1pbmFuY2VBZGp1c3RtZW50UHVycGxlPSIwIiBjcnM6THVtaW5hbmNlQWRqdXN0bWVudE1hZ2VudGE9IjAiIGNyczpTcGxpdFRvbmluZ1NoYWRvd0h1ZT0iMCIgY3JzOlNwbGl0VG9uaW5nU2hhZG93U2F0dXJhdGlvbj0iMCIgY3JzOlNwbGl0VG9uaW5nSGlnaGxpZ2h0SHVlPSIwIiBjcnM6U3BsaXRUb25pbmdIaWdobGlnaHRTYXR1cmF0aW9uPSIwIiBjcnM6U3BsaXRUb25pbmdCYWxhbmNlPSIwIiBjcnM6UGFyYW1ldHJpY1NoYWRvd3M9IjAiIGNyczpQYXJhbWV0cmljRGFya3M9IjAiIGNyczpQYXJhbWV0cmljTGlnaHRzPSIwIiBjcnM6UGFyYW1ldHJpY0hpZ2hsaWdodHM9IjAiIGNyczpQYXJhbWV0cmljU2hhZG93U3BsaXQ9IjI1IiBjcnM6UGFyYW1ldHJpY01pZHRvbmVTcGxpdD0iNTAiIGNyczpQYXJhbWV0cmljSGlnaGxpZ2h0U3BsaXQ9Ijc1IiBjcnM6U2hhcnBlblJhZGl1cz0iKzEuMCIgY3JzOlNoYXJwZW5EZXRhaWw9IjI1IiBjcnM6U2hhcnBlbkVkZ2VNYXNraW5nPSIwIiBjcnM6UG9zdENyb3BWaWduZXR0ZUFtb3VudD0iMCIgY3JzOkdyYWluQW1vdW50PSIwIiBjcnM6TGVuc1Byb2ZpbGVFbmFibGU9IjAiIGNyczpMZW5zTWFudWFsRGlzdG9ydGlvbkFtb3VudD0iMCIgY3JzOlBlcnNwZWN0aXZlVmVydGljYWw9IjAiIGNyczpQZXJzcGVjdGl2ZUhvcml6b250YWw9IjAiIGNyczpQZXJzcGVjdGl2ZVJvdGF0ZT0iMC4wIiBjcnM6UGVyc3BlY3RpdmVTY2FsZT0iMTAwIiBjcnM6UGVyc3BlY3RpdmVBc3BlY3Q9IjAiIGNyczpQZXJzcGVjdGl2ZVVwcmlnaHQ9IjAiIGNyczpQZXJzcGVjdGl2ZVg9IjAuMDAiIGNyczpQZXJzcGVjdGl2ZVk9IjAuMDAiIGNyczpBdXRvTGF0ZXJhbENBPSIwIiBjcnM6RXhwb3N1cmUyMDEyPSIwLjAwIiBjcnM6Q29udHJhc3QyMDEyPSIwIiBjcnM6SGlnaGxpZ2h0czIwMTI9IjAiIGNyczpTaGFkb3dzMjAxMj0iMCIgY3JzOldoaXRlczIwMTI9IjAiIGNyczpCbGFja3MyMDEyPSIwIiBjcnM6Q2xhcml0eTIwMTI9IjAiIGNyczpEZWZyaW5nZVB1cnBsZUFtb3VudD0iMCIgY3JzOkRlZnJpbmdlUHVycGxlSHVlTG89IjMwIiBjcnM6RGVmcmluZ2VQdXJwbGVIdWVIaT0iNzAiIGNyczpEZWZyaW5nZUdyZWVuQW1vdW50PSIwIiBjcnM6RGVmcmluZ2VHcmVlbkh1ZUxvPSI0MCIgY3JzOkRlZnJpbmdlR3JlZW5IdWVIaT0iNjAiIGNyczpEZWhhemU9IjAiIGNyczpUZXh0dXJlPSIwIiBjcnM6VG9uZU1hcFN0cmVuZ3RoPSIwIiBjcnM6Q29udmVydFRvR3JheXNjYWxlPSJGYWxzZSIgY3JzOk92ZXJyaWRlTG9va1ZpZ25ldHRlPSJGYWxzZSIgY3JzOlRvbmVDdXJ2ZU5hbWU9IkxpbmVhciIgY3JzOlRvbmVDdXJ2ZU5hbWUyMDEyPSJMaW5lYXIiIGNyczpDYW1lcmFQcm9maWxlPSJFbWJlZGRlZCIgY3JzOkNhbWVyYVByb2ZpbGVEaWdlc3Q9IjU0NjUwQTM0MUI1QjVDQ0FFODQ0MkQwQjQzQTkyQkNFIiBjcnM6TGVuc1Byb2ZpbGVTZXR1cD0iTGVuc0RlZmF1bHRzIiBjcnM6VXByaWdodFZlcnNpb249IjE1MTM4ODE2MCIgY3JzOlVwcmlnaHRDZW50ZXJNb2RlPSIwIiBjcnM6VXByaWdodENlbnRlck5vcm1YPSIwLjUiIGNyczpVcHJpZ2h0Q2VudGVyTm9ybVk9IjAuNSIgY3JzOlVwcmlnaHRGb2NhbE1vZGU9IjAiIGNyczpVcHJpZ2h0Rm9jYWxMZW5ndGgzNW1tPSIzNSIgY3JzOlVwcmlnaHRQcmV2aWV3PSJGYWxzZSIgY3JzOlVwcmlnaHRUcmFuc2Zvcm1Db3VudD0iNiIgY3JzOlVwcmlnaHRGb3VyU2VnbWVudHNDb3VudD0iMCIgY3JzOkhhc1NldHRpbmdzPSJUcnVlIiBjcnM6SGFzQ3JvcD0iRmFsc2UiIGNyczpBbHJlYWR5QXBwbGllZD0iVHJ1ZSIgY3JzOlJhd0ZpbGVOYW1lPSJmb3JlZ3JvdW5kU291cmNlLnRpZiIgdGlmZjpYUmVzb2x1dGlvbj0iMzAwLzEiIHRpZmY6WVJlc29sdXRpb249IjMwMC8xIiB0aWZmOlJlc29sdXRpb25Vbml0PSIyIiBleGlmOkV4aWZWZXJzaW9uPSIwMjMxIiBleGlmOkNvbG9yU3BhY2U9IjY1NTM1IiBleGlmOlBpeGVsWERpbWVuc2lvbj0iMzYwMCIgZXhpZjpQaXhlbFlEaW1lbnNpb249IjIzMDAiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmMjJhYTlmNy05MzczLTRlOTYtOGYzZS03YmQ3Mjc3ZTgzNmIiIHN0RXZ0OndoZW49IjIwMjAtMDktMjdUMTU6NTAtMDQ6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDYW1lcmEgUmF3IDExLjMuMSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iL21ldGFkYXRhIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2NzkyNWExZC1kNjVjLTQ3NmQtOGFiYy04NDBkODVmMjZjNjMiIHN0RXZ0OndoZW49IjIwMjEtMDEtMjVUMTI6NTg6MzktMDU6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDYW1lcmEgUmF3IDExLjMuMSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iL21ldGFkYXRhIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MDY2YWMzZS02MjdiLTQ5MDQtYmNhOC03ZjU2MjkxYTZiOTQiIHN0RXZ0OndoZW49IjIwMjEtMDEtMzBUMTQ6MTQ6MTEtMDU6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDYW1lcmEgUmF3IDExLjMuMSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YjQ0ZGJmZDktYTYxNy00MjJmLTk2NjctMzgyYjE2ZWZhNTc3IiBzdEV2dDp3aGVuPSIyMDIxLTAxLTMwVDE0OjIwOjU1LTA1OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY29udmVydGVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJmcm9tIGltYWdlL3RpZmYgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJkZXJpdmVkIiBzdEV2dDpwYXJhbWV0ZXJzPSJjb252ZXJ0ZWQgZnJvbSBpbWFnZS90aWZmIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6YTdlNTY5YjItZmIzNC00NThjLWIzYzktNDg2MDkxZWIzYjJmIiBzdEV2dDp3aGVuPSIyMDIxLTAxLTMwVDE0OjIwOjU1LTA1OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6OWQyNTEyYTAtNjc3Mi00NjM2LWJmZjQtYjliMTJlYTI5NGM0IiBzdEV2dDp3aGVuPSIyMDIxLTAxLTMwVDE0OjI0OjQxLTA1OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6YjQ0ZGJmZDktYTYxNy00MjJmLTk2NjctMzgyYjE2ZWZhNTc3IiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6MDQ1NjRlZGQtNjUwZC04OTQzLWE0OTQtOTQzYjlhNDBlM2U3IiBzdFJlZjpvcmlnaW5hbERvY3VtZW50SUQ9IjhBMzJFMEExMUE0NjFEMTZDNDc1NzVCRjY4Mzk3QkJBIi8+IDxjcnM6VG9uZUN1cnZlPiA8cmRmOlNlcT4gPHJkZjpsaT4wLCAwPC9yZGY6bGk+IDxyZGY6bGk+MjU1LCAyNTU8L3JkZjpsaT4gPC9yZGY6U2VxPiA8L2NyczpUb25lQ3VydmU+IDxjcnM6VG9uZUN1cnZlUmVkPiA8cmRmOlNlcT4gPHJkZjpsaT4wLCAwPC9yZGY6bGk+IDxyZGY6bGk+MjU1LCAyNTU8L3JkZjpsaT4gPC9yZGY6U2VxPiA8L2NyczpUb25lQ3VydmVSZWQ+IDxjcnM6VG9uZUN1cnZlR3JlZW4+IDxyZGY6U2VxPiA8cmRmOmxpPjAsIDA8L3JkZjpsaT4gPHJkZjpsaT4yNTUsIDI1NTwvcmRmOmxpPiA8L3JkZjpTZXE+IDwvY3JzOlRvbmVDdXJ2ZUdyZWVuPiA8Y3JzOlRvbmVDdXJ2ZUJsdWU+IDxyZGY6U2VxPiA8cmRmOmxpPjAsIDA8L3JkZjpsaT4gPHJkZjpsaT4yNTUsIDI1NTwvcmRmOmxpPiA8L3JkZjpTZXE+IDwvY3JzOlRvbmVDdXJ2ZUJsdWU+IDxjcnM6VG9uZUN1cnZlUFYyMDEyPiA8cmRmOlNlcT4gPHJkZjpsaT4wLCAwPC9yZGY6bGk+IDxyZGY6bGk+MjU1LCAyNTU8L3JkZjpsaT4gPC9yZGY6U2VxPiA8L2NyczpUb25lQ3VydmVQVjIwMTI+IDxjcnM6VG9uZUN1cnZlUFYyMDEyUmVkPiA8cmRmOlNlcT4gPHJkZjpsaT4wLCAwPC9yZGY6bGk+IDxyZGY6bGk+MjU1LCAyNTU8L3JkZjpsaT4gPC9yZGY6U2VxPiA8L2NyczpUb25lQ3VydmVQVjIwMTJSZWQ+IDxjcnM6VG9uZUN1cnZlUFYyMDEyR3JlZW4+IDxyZGY6U2VxPiA8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"

    }

    // set as dirty
    this.invalidate = function() {
        view.isDirty = true
    }

    // creates context
    this.createContext = function() {
        view.canvas = document.getElementById('canvas')
        view.context = view.canvas.getContext('2d')
        view.pixelRatio = view.getPixelRatio()

        view.updateScalingSubroutine()

        // TODO: figure out proper handlers for canvas context load completion
        view.isReadyContext = true
    }

    // get pixel ratio
    this.getPixelRatio = function() {
        var backingStore = view.context.backingStorePixelRatio ||
            view.context.webkitBackingStorePixelRatio ||
            view.context.mozBackingStorePixelRatio ||
            view.context.msBackingStorePixelRatio ||
            view.context.oBackingStorePixelRatio ||
            view.context.backingStorePixelRatio || 1
        return (window.devicePixelRatio || 1) / backingStore
    }

    // update the scaling of view elements, but only if the window dimensions have changed
    this.updateScaling = function(model = null) {
        let width = window.innerWidth
        let height = window.innerHeight

        if(view.lastWidth !== width || view.lastHeight !== height) {
            view.isDirty = true

            view.lastWidth = width
            view.lastHeight = height

            view.updateScalingSubroutine()
        }
    }

    // update the scaling of view elements
    this.updateScalingSubroutine = function() {
        if(view.canvas !== undefined) {
            view.canvas.style.width = window.innerWidth + "px"
            view.canvas.style.height = window.innerHeight + "px"
            view.canvas.width = view.pixelRatio * window.innerWidth
            view.canvas.height = view.pixelRatio * window.innerHeight
        }
        view.updateParallax()
    }

    this.updateParallax = function() {
        view.parallaxFactor = document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)
    }

    // render!
    this.renderModel = function(model) {
        if(model.isReady && view.isReadyContext && view.isDirty) {
            
            /*
            view.context.fillStyle = "#FFFFFF"

            view.context.fillRect(0, 0, window.innerWidth * view.pixelRatio, window.innerHeight * view.pixelRatio)
            */

            // TODO: move calculations to model
            
            let image = null
            if(view.isReadyImageBackground) {
                image = view.imageBackground
            } else if(view.isReadyImageBackgroundTemp) {
                image = view.imageBackgroundTemp
            }

            if(image != null) {
                let ratioClient = window.innerWidth / window.innerHeight
                let ratioImageEffective = image.width / (image.height / (1 + view.parallaxStrengthBackground))

                let x = 0
                let y = 0
                let width = 0
                let height = 0
                if(ratioClient < ratioImageEffective) {
                    height = window.innerHeight * view.pixelRatio * (1 + view.parallaxStrengthBackground)
                    width = height * view.imageBackgroundTemp.width / view.imageBackgroundTemp.height
                    x = - (width - window.innerWidth * view.pixelRatio) / 2
                    y = - window.innerHeight * view.pixelRatio * view.parallaxStrengthBackground * view.parallaxFactor
                } else {
                    width = window.innerWidth * view.pixelRatio
                    height = width * image.height / image.width
                    x = - (width - window.innerWidth * view.pixelRatio) / 2
                    y = - window.innerHeight * view.pixelRatio * view.parallaxStrengthBackground * view.parallaxFactor
                }
                view.context.drawImage(image, x, y, width, height)
            }

            // setup clipping window
            view.context.save()

            view.context.beginPath()
            
            for(let i = 0; i < model.tabs.length; i++) {
                rect = model.tabs[i].getBoundingClientRect()

                if(rect.x + rect.width >= 0 && rect.x <= window.innerWidth && rect.y + rect.height >= 0 && rect.y <= window.innerHeight) {
                    view.context.rect(Math.ceil(rect.x * view.pixelRatio), Math.ceil(rect.y * view.pixelRatio), Math.ceil(rect.width * view.pixelRatio), Math.ceil(rect.height * view.pixelRatio))
                }
            }

            for(let i = 0; i < model.headlines.length; i++) {
                rect = model.headlines[i].getBoundingClientRect()

                if(rect.x + rect.width >= 0 && rect.x <= window.innerWidth && rect.y + rect.height >= 0 && rect.y <= window.innerHeight) {
                    view.context.rect(Math.ceil(rect.x * view.pixelRatio), Math.ceil(rect.y * view.pixelRatio), Math.ceil(rect.width * view.pixelRatio), Math.ceil(rect.height * view.pixelRatio))
                }
            }

            for(let i = 0; i < model.quotes.length; i++) {
                rect = model.quotes[i].getBoundingClientRect()

                if(rect.x + rect.width >= 0 && rect.x <= window.innerWidth && rect.y + rect.height >= 0 && rect.y <= window.innerHeight) {
                    view.context.rect(Math.ceil(rect.x * view.pixelRatio), Math.ceil(rect.y * view.pixelRatio), Math.ceil(rect.width * view.pixelRatio), Math.ceil(rect.height * view.pixelRatio))
                }
            }

            view.context.closePath()

            view.context.clip();

            image = null
            if(view.isReadyImageForeground) {
                image = view.imageForeground
            } else if(view.isReadyImageForegroundTemp) {
                image = view.imageForegroundTemp
            }

            if(image != null) {
                let ratioClient = window.innerWidth / window.innerHeight
                let ratioImageEffective = image.width / (image.height / (1 + view.parallaxStrengthForeground))

                let x = 0
                let y = 0
                let width = 0
                let height = 0
                if(ratioClient < ratioImageEffective) {
                    height = window.innerHeight * view.pixelRatio * (1 + view.parallaxStrengthForeground)
                    width = height * view.imageBackgroundTemp.width / view.imageBackgroundTemp.height
                    x = - (width - window.innerWidth * view.pixelRatio) / 2
                    y = - window.innerHeight * view.pixelRatio * view.parallaxStrengthForeground * view.parallaxFactor
                } else {
                    width = window.innerWidth * view.pixelRatio
                    height = width * image.height / image.width
                    x = - (width - window.innerWidth * view.pixelRatio) / 2
                    y = - window.innerHeight * view.pixelRatio * view.parallaxStrengthForeground * view.parallaxFactor
                }
                view.context.drawImage(image, x, y, width, height)
            }

            view.context.restore()

            // this is gross, performance wise, but safari lags unacceptably when the view becomes dirty again, dropping way too many frames
            //view.isDirty = false
        }
    }
}

function Model() {
    let model = this

    this.isReady = false

    this.initialize = function() {
        model.tabs = document.getElementsByClassName("tab instance")
        model.headlines = document.getElementsByClassName("headline")
        model.quotes = document.getElementsByClassName("content quote")
        model.isReady = true
    }

    // TODO: update method for parallax offsets
}

function Controller() {
    let controller = this

    this.initialized = false

    this.initialize = function() {
        controller.view = new View()
        controller.view.initialize()
        controller.model = new Model()
        controller.model.initialize()

        window.onscroll = function() {
            controller.view.invalidate()
            controller.view.updateParallax()
        }
        /*
        window.onmousemove = function() {
            controller.view.invalidate()
        }
        */
        window.requestAnimationFrame(controller.update)
    }

    this.update = function() {
        controller.view.updateScaling()
        controller.view.renderModel(controller.model)
        window.requestAnimationFrame(controller.update);
    }
}

let controller = new Controller()
window.onload = controller.initialize
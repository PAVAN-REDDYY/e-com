{{- define "ecom.name" -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- end }}



{{- define "ecom.labels" -}}
app.kubernetes.io/name: {{ include "ecom.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}



{{- define "ecom.selectorLabels" -}}
app.kubernetes.io/name: {{ include "ecom.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

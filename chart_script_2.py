import plotly.graph_objects as go
import pandas as pd

# Data for compliance coverage with additional context
compliance_data = {
    'Regulation': ['GDPR', 'CCPA', 'CPRA'],
    'Coverage': [94, 91, 89],
    'Violations': [3, 1, 2],
    'Status': ['good', 'good', 'warning']
}

df = pd.DataFrame(compliance_data)

# Create figure
fig = go.Figure()

# Color mapping based on status and performance
colors = []
for coverage in df['Coverage']:
    if coverage >= 95:
        colors.append('#2E8B57')  # Green - excellent
    elif coverage >= 90:
        colors.append('#1FB8CD')  # Cyan - good  
    elif coverage >= 85:
        colors.append('#D2BA4C')  # Yellow - warning
    else:
        colors.append('#DB4545')  # Red - critical

# Add main coverage bars
fig.add_trace(go.Bar(
    x=df['Regulation'],
    y=df['Coverage'],
    marker_color=colors,
    text=[f'{val}%<br>{viol} violations' for val, viol in zip(df['Coverage'], df['Violations'])],
    textposition='outside',
    textfont=dict(size=16, color='white'),
    name='Coverage %',
    opacity=0.9
))

# Add target threshold lines
fig.add_hline(
    y=95, 
    line_dash="solid", 
    line_color="#2E8B57",
    line_width=2,
    annotation_text="Excellent: 95%+",
    annotation_position="top right",
    annotation_font_color="#2E8B57",
    annotation_font_size=12
)

fig.add_hline(
    y=90, 
    line_dash="dash", 
    line_color="#1FB8CD",
    line_width=2,
    annotation_text="Good: 90%+",
    annotation_position="top right",
    annotation_font_color="#1FB8CD",
    annotation_font_size=12
)

fig.add_hline(
    y=85, 
    line_dash="dot", 
    line_color="#D2BA4C",
    line_width=2,
    annotation_text="Warning: 85%+",
    annotation_position="top right", 
    annotation_font_color="#D2BA4C",
    annotation_font_size=12
)

# Update layout for professional dashboard
fig.update_layout(
    title='Privacy Compliance Coverage',
    xaxis_title='Regulations',
    yaxis_title='Coverage %',
    plot_bgcolor='rgba(0,0,0,0)',
    paper_bgcolor='#1a1a1a',
    font=dict(color='white', size=14),
    showlegend=False,
    yaxis=dict(
        range=[80, 100],
        ticksuffix='%',
        gridcolor='rgba(128,128,128,0.2)',
        tickfont=dict(color='white', size=14),
        title_font=dict(color='white', size=16)
    ),
    xaxis=dict(
        tickfont=dict(color='white', size=16),
        title_font=dict(color='white', size=16)
    ),
    title_font=dict(size=24, color='white'),
    annotations=[
        # Add key metrics summary at bottom
        dict(
            text="Key Metrics: MTTR 8min (Target <10) | Policy Violations 12% (Target <15) | Exception Rate 0.3% (Target <1)",
            x=0.5, y=-0.15,
            xref="paper", yref="paper",
            showarrow=False,
            font=dict(size=12, color='rgba(255,255,255,0.8)'),
            xanchor='center'
        ),
        # Add processing stats
        dict(
            text="Daily Processing: 156 Builds | 134 Security Scans | 298 Policy Checks | 8 Blocked Deployments",
            x=0.5, y=-0.22,
            xref="paper", yref="paper", 
            showarrow=False,
            font=dict(size=12, color='rgba(255,255,255,0.8)'),
            xanchor='center'
        )
    ]
)

# Update traces for better visibility
fig.update_traces(cliponaxis=False)

# Save as both PNG and SVG
fig.write_image('compliance_dashboard.png')
fig.write_image('compliance_dashboard.svg', format='svg')

fig.show()
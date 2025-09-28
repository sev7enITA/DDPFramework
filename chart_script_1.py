import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import json

# Parse the data
data = {
  "timeline": [
    {
      "year": 2020,
      "threats": [
        {
          "name": "Browser Fingerprinting",
          "severity": "medium",
          "regulatory_coverage": "limited",
          "ddp_mitigation": "Automated detection & blocking"
        }
      ]
    },
    {
      "year": 2022,
      "threats": [
        {
          "name": "IoT Data Collection",
          "severity": "high", 
          "regulatory_coverage": "partial",
          "ddp_mitigation": "Pervasive encryption enforcement"
        }
      ]
    },
    {
      "year": 2024,
      "threats": [
        {
          "name": "Inference Attacks on FL",
          "severity": "high",
          "regulatory_coverage": "none",
          "ddp_mitigation": "Proactive threat modeling"
        }
      ]
    },
    {
      "year": 2026,
      "threats": [
        {
          "name": "Basic Brain-Computer Interfaces", 
          "severity": "critical",
          "regulatory_coverage": "none",
          "ddp_mitigation": "Ethical framework development"
        }
      ]
    },
    {
      "year": 2028,
      "threats": [
        {
          "name": "Advanced AI Inference",
          "severity": "high",
          "regulatory_coverage": "limited", 
          "ddp_mitigation": "Dynamic policy adaptation"
        }
      ]
    },
    {
      "year": 2030,
      "threats": [
        {
          "name": "Quantum Computing Threat",
          "severity": "critical",
          "regulatory_coverage": "none",
          "ddp_mitigation": "Crypto-agility implementation"
        }
      ]
    },
    {
      "year": 2032,
      "threats": [
        {
          "name": "Pervasive Neural Monitoring",
          "severity": "critical", 
          "regulatory_coverage": "none",
          "ddp_mitigation": "Neural data protection protocols"
        }
      ]
    },
    {
      "year": 2035,
      "threats": [
        {
          "name": "Quantum-Scale Data Breach",
          "severity": "critical",
          "regulatory_coverage": "limited",
          "ddp_mitigation": "Post-quantum governance model"
        }
      ]
    }
  ],
  "severity_levels": {
    "low": "#10B981",
    "medium": "#F59E0B", 
    "high": "#EF4444",
    "critical": "#7C2D12"
  },
  "coverage_levels": {
    "none": "#9CA3AF",
    "limited": "#FCD34D",
    "partial": "#FBBF24", 
    "comprehensive": "#10B981"
  },
  "ddp_milestones": [
    {"year": 2025, "milestone": "DDP Framework Launch", "description": "IEEE ISOPE presentation"},
    {"year": 2027, "milestone": "Quantum Preparation", "description": "Crypto-agility protocols"},
    {"year": 2030, "milestone": "Neural Data Standards", "description": "BCI governance framework"},
    {"year": 2033, "milestone": "Post-Quantum Privacy", "description": "Full quantum-resistant model"}
  ]
}

# Create better abbreviations for threat names
def smart_abbreviate(text, max_len=15):
    if len(text) <= max_len:
        return text
    
    abbrev_map = {
        "Browser Fingerprinting": "Browser Fingerp",
        "IoT Data Collection": "IoT Data Collect",
        "Inference Attacks on FL": "FL Inference Att", 
        "Basic Brain-Computer Interfaces": "Basic BCIs",
        "Advanced AI Inference": "AI Inference",
        "Quantum Computing Threat": "Quantum Threat",
        "Pervasive Neural Monitoring": "Neural Monitor",
        "Quantum-Scale Data Breach": "Quantum Breach"
    }
    
    return abbrev_map.get(text, text[:max_len])

# Extract timeline data
years = []
threat_names = []
severities = []
coverages = []
mitigations = []
full_names = []

for item in data["timeline"]:
    year = item["year"]
    for threat in item["threats"]:
        years.append(year)
        full_names.append(threat["name"])
        threat_names.append(smart_abbreviate(threat["name"]))
        severities.append(threat["severity"])
        coverages.append(threat["regulatory_coverage"])
        mitigations.append(threat["ddp_mitigation"])

# Create the main timeline chart
fig = go.Figure()

# Add main timeline line
fig.add_shape(
    type="line",
    x0=2020, x1=2035,
    y0=1, y1=1,
    line=dict(color="#1FB8CD", width=4)
)

# Add threat points above the timeline
threat_y_positions = [1.5, 1.8, 1.5, 1.8, 1.5, 1.8, 1.5, 1.8]  # Alternate positions for better spacing

for i, (year, name, full_name, severity, coverage, mitigation, y_pos) in enumerate(zip(years, threat_names, full_names, severities, coverages, mitigations, threat_y_positions)):
    
    # Map coverage to border width
    coverage_borders = {"none": 1, "limited": 2, "partial": 3, "comprehensive": 4}
    
    fig.add_trace(go.Scatter(
        x=[year],
        y=[y_pos],
        mode='markers+text',
        marker=dict(
            color=data["severity_levels"][severity],
            size=18,
            line=dict(width=coverage_borders[coverage], color=data["coverage_levels"][coverage])
        ),
        text=name,
        textposition="top center" if y_pos > 1.6 else "bottom center",
        textfont=dict(size=9),
        hovertemplate=f"<b>{full_name}</b><br>" +
                     f"Year: {year}<br>" +
                     f"Severity: {severity}<br>" +
                     f"Reg Coverage: {coverage}<br>" +
                     f"DDP Response: {mitigation}<extra></extra>",
        showlegend=False,
        name=full_name
    ))

# Add year markers on timeline
year_markers = [2020, 2022, 2024, 2026, 2028, 2030, 2032, 2035]
for year in year_markers:
    fig.add_trace(go.Scatter(
        x=[year],
        y=[1],
        mode='markers',
        marker=dict(
            color='#1FB8CD',
            size=8,
            symbol='circle'
        ),
        showlegend=False,
        hoverinfo='skip'
    ))

# Add DDP milestones below the timeline
for milestone in data["ddp_milestones"]:
    fig.add_trace(go.Scatter(
        x=[milestone["year"]],
        y=[0.5],
        mode='markers+text',
        marker=dict(
            color='#1FB8CD',
            size=15,
            symbol='diamond'
        ),
        text=smart_abbreviate(milestone["milestone"]),
        textposition="bottom center",
        textfont=dict(size=8, color='#1FB8CD'),
        hovertemplate=f"<b>{milestone['milestone']}</b><br>" +
                     f"Year: {milestone['year']}<br>" +
                     f"{milestone['description']}<extra></extra>",
        showlegend=False,
        name=milestone["milestone"]
    ))

# Add legend traces for severity levels
severity_order = ["low", "medium", "high", "critical"]
for severity in severity_order:
    if severity in data["severity_levels"]:
        fig.add_trace(go.Scatter(
            x=[None], y=[None],
            mode='markers',
            marker=dict(color=data["severity_levels"][severity], size=12),
            name=f"{severity.title()}",
            legendgroup="severity",
            legendgrouptitle_text="Threat Severity"
        ))

# Add legend traces for coverage levels  
coverage_order = ["none", "limited", "partial", "comprehensive"]
for coverage in coverage_order:
    if coverage in data["coverage_levels"]:
        border_width = {"none": 1, "limited": 2, "partial": 3, "comprehensive": 4}[coverage]
        fig.add_trace(go.Scatter(
            x=[None], y=[None],
            mode='markers',
            marker=dict(
                color='lightgray', 
                size=12, 
                line=dict(width=border_width, color=data["coverage_levels"][coverage])
            ),
            name=f"{coverage.title()}",
            legendgroup="coverage",
            legendgrouptitle_text="Reg Coverage"
        ))

# Update layout
fig.update_layout(
    title="Privacy Threats Evolution & DDP Response",
    xaxis_title="Year",
    xaxis=dict(
        range=[2019, 2036],
        tickmode='linear',
        dtick=2,
        showgrid=True,
        gridcolor='lightgray',
        gridwidth=1
    ),
    yaxis=dict(
        range=[0, 2.2],
        showticklabels=False,
        showgrid=False,
        zeroline=False
    ),
    legend=dict(
        orientation='v',
        yanchor='top',
        y=1,
        xanchor='left',
        x=1.02,
        tracegroupgap=10
    ),
    hovermode='closest',
    plot_bgcolor='white'
)

# Add annotations for timeline sections
fig.add_annotation(
    x=2022.5, y=2.1,
    text="Current Threats",
    showarrow=False,
    font=dict(size=10, color='gray')
)

fig.add_annotation(
    x=2027, y=2.1,
    text="Near-term",
    showarrow=False,
    font=dict(size=10, color='gray')
)

fig.add_annotation(
    x=2033, y=2.1,
    text="Future Threats",
    showarrow=False,
    font=dict(size=10, color='gray')
)

fig.update_traces(cliponaxis=False)

# Save as PNG and SVG
fig.write_image("timeline_chart.png")
fig.write_image("timeline_chart.svg", format="svg")

fig.show()
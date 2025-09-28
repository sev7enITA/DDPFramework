# Create an improved comprehensive mermaid flowchart for the DDP Framework's three-tier governance model

diagram_code = """
flowchart TD
    Start([New Request<br/>Entry Point]) --> Decision{Route Request}
    
    Decision --> |Standard Policy| T1[Tier 1: Automated Compliance<br/>Routine Policy Enforcement<br/>━━━━━━━━━━━━━━━━━━━━━━━━<br/>Volume: 847 requests today<br/>Success Rate: 88%<br/>Avg Time: < 1 minute<br/>━━━━━━━━━━━━━━━━━━━━━━━━<br/>Stakeholders:<br/>• CI/CD System<br/>• Policy Engine<br/>• Code Repository]
    
    T1 --> |Exception<br/>Required| T2[Tier 2: Managed Exceptions<br/>Justified Deviations with Review<br/>━━━━━━━━━━━━━━━━━━━━━━━━<br/>Volume: 12 pending<br/>Success Rate: 75% approved<br/>Avg Time: 6 hours<br/>━━━━━━━━━━━━━━━━━━━━━━━━<br/>Stakeholders:<br/>• Legal Team<br/>• Security Team<br/>• Product Team]
    
    T2 --> |Novel/High<br/>Risk Issue| T3[Tier 3: Ethical Deliberation<br/>Novel Issues Requiring Judgment<br/>━━━━━━━━━━━━━━━━━━━━━━━━<br/>Volume: 2 active cases<br/>Success Rate: 100% resolved<br/>Avg Time: 4.2 days<br/>━━━━━━━━━━━━━━━━━━━━━━━━<br/>Stakeholders:<br/>• Ethics Board<br/>• External Experts<br/>• Academics]
    
    T1 --> Success1([Request<br/>Complete])
    T2 --> Success2([Request<br/>Complete])
    T3 --> Success3([Request<br/>Complete])
    
    T3 --> |New Policy<br/>Created| T1
    
    subgraph MetricsBox[" Framework Performance Metrics "]
        direction TB
        M1[📊 MTTR: 8 minutes<br/>Trend: ↓12% improvement]
        M2[🚫 Policy Violation Rate: 12%<br/>Trend: ↑2% increase]
        M3[⚡ Exception Request Rate: 0.3%<br/>Trend: →0% stable]  
        M4[🔍 Ethical Review Cycle: 4.2 days<br/>Trend: ↓8% improvement]
    end
    
    classDef tier1 fill:#10B981,stroke:#059669,stroke-width:3px,color:#fff
    classDef tier2 fill:#F59E0B,stroke:#D97706,stroke-width:3px,color:#fff
    classDef tier3 fill:#EF4444,stroke:#DC2626,stroke-width:3px,color:#fff
    classDef metric fill:#3B82F6,stroke:#1D4ED8,stroke-width:2px,color:#fff
    classDef process fill:#6B7280,stroke:#374151,stroke-width:2px,color:#fff
    classDef decision fill:#8B5CF6,stroke:#7C3AED,stroke-width:2px,color:#fff
    
    class T1 tier1
    class T2 tier2
    class T3 tier3
    class M1,M2,M3,M4 metric
    class Start,Success1,Success2,Success3 process
    class Decision decision
"""

# Create the improved mermaid diagram
png_path, svg_path = create_mermaid_diagram(
    diagram_code, 
    png_filepath='ddp_framework_improved.png',
    svg_filepath='ddp_framework_improved.svg',
    width=1600,
    height=1200
)

print(f"Improved chart saved as: {png_path} and {svg_path}")
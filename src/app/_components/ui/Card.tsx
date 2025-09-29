import React from "react";
import { Card, Divider, Typography } from "antd";

const { Title, Text, Paragraph } = Typography;

interface Section {
  title: string;
  content: React.ReactNode;
}

interface StatCardProps {
  title: string;
  value: string | number;
  sections: Section[];
  highlightColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  sections,
  highlightColor = "#1677ff",
}) => {
  return (
    <div
      style={{
        width: "100%",
        borderRadius: 12,
        padding: 12,
      }}
    >
      <Card
        title={
          <Title level={4} style={{ margin: 0, color: highlightColor }}>
            {title}
          </Title>
        }
        variant="borderless"
        style={{
          borderRadius: 12,
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          height: "100%",
          

        }}
      >
        <Title level={3} style={{ textAlign: "center", marginBottom: 16 }}>
          {value}
        </Title>

        {sections.map((section, index) => (
          <React.Fragment key={index}>
            <Divider />
            <section>
              <Title level={5}>{section.title}</Title>
              {section.content}
            </section>
          </React.Fragment>
        ))}
      </Card>
    </div>
  );
};

export default StatCard;

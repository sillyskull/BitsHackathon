from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet

def generate_brain_tumor_mri_report(
    filename, 
    report_title_text, 
    patient_name, 
    patient_info_data, 
    mri_findings_data, 
    mri_image_path, 
    impressions_text, 
    recommendations_text, 
    conclusion_text,
    logo_path
):
    doc = SimpleDocTemplate(filename, pagesize=A4)
    styles = getSampleStyleSheet()
    story = []

    if logo_path:
        story.append(Spacer(1, -60))
        logo = Image(logo_path, width=100, height=100)
        logo.hAlign = 'CENTER'
        story.append(logo)
        story.append(Spacer(1, 5))

    hospital_name = Paragraph("<b>TT Medical Clinic</b>", styles['Title'])
    story.append(hospital_name)
    story.append(Spacer(1, 10))

    report_title = Paragraph(f"<b>{report_title_text}</b>", styles['Title'])
    story.append(report_title)
    story.append(Spacer(1, 10))

    patient_info = [["Patient Information", ""]] + [["Name:", patient_name]] + patient_info_data
    table = Table(patient_info, colWidths=[150, 350])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (1, 0), colors.lightgrey),
        ('SPAN', (0, 0), (1, 0)),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONT', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONT', (0, 1), (-1, -1), 'Helvetica'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ]))
    story.append(table)
    story.append(Spacer(1, 12))

    mri_findings = [["MRI Findings", ""]] + mri_findings_data
    table = Table(mri_findings, colWidths=[150, 350])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (1, 0), colors.lightgrey),
        ('SPAN', (0, 0), (1, 0)),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONT', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONT', (0, 1), (-1, -1), 'Helvetica'),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ]))
    story.append(table)
    story.append(Spacer(1, 12))

    mri_scan_heading = Paragraph("<b>MRI Scan</b>", styles['Heading2'])
    story.append(mri_scan_heading)
    story.append(Spacer(1, 6))

    if mri_image_path:
        mri_image = Image(mri_image_path, width=400, height=300)
        story.append(mri_image)
        story.append(Spacer(1, 12))

    impressions = Paragraph(
        f"<b>Impressions</b><br/>{impressions_text}",
        styles['BodyText']
    )
    story.append(impressions)
    story.append(Spacer(1, 12))

    recommendations = Paragraph(
        f"<b>Recommendations</b><br/>{recommendations_text}",
        styles['BodyText']
    )
    story.append(recommendations)
    story.append(Spacer(1, 12))

    conclusion = Paragraph(
        f"<b>Conclusion</b><br/>{conclusion_text}",
        styles['BodyText']
    )
    story.append(conclusion)
    story.append(Spacer(1, 12))

    footer_note = Paragraph("<i>This is an AI-generated PDF document</i>", styles['Normal'])
    story.append(Spacer(1, 24))
    story.append(footer_note)

    doc.build(story)
    print(f"PDF generated as {filename}")

generate_brain_tumor_mri_report(
    filename="Brain_Tumor_MRI_Report.pdf",
    report_title_text="Brain Tumor MRI Report",
    patient_name="John Doe",
    patient_info_data=[
        ["Age:", "30"],
        ["Gender:", "Male"],
        ["Relevant Medical History:", "No known neurological conditions."]
    ],
    mri_findings_data=[
        ["Tumor Location:", "Frontal Lobe"],
        ["Tumor Size:", "2.5 x 3.0 x 3.2 cm"]
    ],
    mri_image_path="1.png",
    impressions_text="The tumor is located in the frontal lobe with no significant mass effect.",
    recommendations_text="- Follow-up: Repeat imaging in 3 months.<br/>"
                         "- Further Consultation: Neurosurgeon recommended.<br/>"
                         "- Additional Testing: Consider biopsy if clinically indicated.",
    conclusion_text="Tumor identified with no immediate signs of concern. Monitoring suggested.",
    logo_path="logo.png"
)

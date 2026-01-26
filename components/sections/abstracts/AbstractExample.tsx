import { ReactNode, memo } from 'react'

interface AbstractExampleProps {
    children?: ReactNode;
}

// Extract styles to constants
const SECTION_STYLE = {
    backgroundColor: '#f8f9fa',
    paddingTop: '60px',
    paddingBottom: '60px'
} as const;

const CARD_STYLE = {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid #e0e0e0'
} as const;

const TITLE_STYLE = {
    fontWeight: 'bold',
    color: '#000',
    marginBottom: '15px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px',
    lineHeight: '1.5'
} as const;

const AUTHORS_STYLE = {
    margin: '0 0 15px 0',
    color: '#333',
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif'
} as const;

const AFFILIATIONS_STYLE = {
    fontSize: '13px',
    color: '#555',
    marginBottom: '15px',
    lineHeight: '1.7',
    fontFamily: 'Arial, sans-serif'
} as const;

const CORRESPONDING_STYLE = {
    margin: '0 0 25px 0',
    color: '#333',
    fontSize: '13px',
    fontStyle: 'italic',
    fontFamily: 'Arial, sans-serif'
} as const;

const HR_STYLE = {
    border: 'none',
    borderTop: '1px solid #e0e0e0',
    margin: '20px 0'
} as const;

const SECTION_TEXT_STYLE = {
    margin: 0,
    fontSize: '14px',
    lineHeight: '1.8',
    color: '#333',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'justify'
} as const;

const SECTION_CONTAINER_STYLE = { marginBottom: '20px' } as const;
const AFFILIATION_ITEM_STYLE = { margin: '0 0 5px 0' } as const;
const UNDERLINE_STYLE = { textDecoration: 'underline' } as const;

function AbstractExample({ children }: AbstractExampleProps) {
    return (
        <div className="sp1" style={SECTION_STYLE}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-10 m-auto">
                        <div className="heading2 text-center space-margin60">
                            <h2 data-aos="fade-up" data-aos-duration={800}>Example</h2>
                        </div>

                        <div data-aos="fade-up" data-aos-duration={1000} style={CARD_STYLE}>
                            {/* Title */}
                            <h5 style={TITLE_STYLE}>
                                Telehealth for optimizing asthma management during pregnancy: a randomized controlled trial
                            </h5>

                            {/* Authors */}
                            <p style={AUTHORS_STYLE}>
                                <span style={UNDERLINE_STYLE}>Elida Zairina</span><sup>1</sup>, Michael J Abramson<sup>2</sup>, Kay Stewart<sup>3</sup>, Johnson George<sup>3</sup>
                            </p>

                            {/* Affiliations */}
                            <div style={AFFILIATIONS_STYLE}>
                                <p style={AFFILIATION_ITEM_STYLE}><sup>1</sup>Dept of Pharmacy Practice, Faculty of Pharmacy, Universitas Airlangga, Surabaya, Indonesia</p>
                                <p style={AFFILIATION_ITEM_STYLE}><sup>2</sup>Dept of Epidemiology, School of Public Health and Preventive Medicine, Monash University, Melbourne, Australia</p>
                                <p style={{ margin: 0 }}><sup>3</sup>Centre for Medicine Use and Safety, Faculty of Pharmacy and Pharmaceutical Sciences, Monash University, Melbourne, Australia</p>
                            </div>

                            {/* Corresponding Author */}
                            <p style={CORRESPONDING_STYLE}>
                                Corresponding Author: Elida Zairina, elida-z@ff.unair.ac.id
                            </p>

                            <hr style={HR_STYLE} />

                            {/* Background */}
                            <div style={SECTION_CONTAINER_STYLE}>
                                <p style={SECTION_TEXT_STYLE}>
                                    <strong>Background:</strong> Managing asthma in pregnant women is an integral part of asthma guidelines; however poorly controlled asthma during pregnancy remains a major problem. This study aimed to evaluate the efficacy of a telehealth program supported by a handheld respiratory device in improving asthma control during pregnancy.
                                </p>
                            </div>

                            {/* Methods */}
                            <div style={SECTION_CONTAINER_STYLE}>
                                <p style={SECTION_TEXT_STYLE}>
                                    <strong>Methods:</strong> Pregnant women with asthma (n=72) from two antenatal clinics in Melbourne, Australia were randomized to one of the two groups: 1) intervention – involving a telehealth program and written asthma action plan supported by a handheld respiratory device and a smart phone application (<em>Breathe-easy</em>®); or 2) control group – usual care. Both groups were followed prospectively, and their asthma control scores were compared at 3 and 6 months.
                                </p>
                            </div>

                            {/* Results */}
                            <div style={SECTION_CONTAINER_STYLE}>
                                <p style={SECTION_TEXT_STYLE}>
                                    <strong>Results:</strong> At baseline, participants' mean (±SD) age was 31.4±4.5 years and gestational age 16.7±3.1 weeks. No significant differences in demographic, maternal or clinical characteristics were observed. At 6 months, compared to the usual care group, the intervention group had better asthma control (<em>p</em>=0.02) and asthma-related quality of life (<em>p</em>&lt;0.01). There were no significant differences between groups in lung function, unscheduled healthcare visits, days off work/study, oral corticosteroid use or perinatal outcomes. No significant differences between groups were found in 3 months.
                                </p>
                            </div>

                            {/* Conclusions */}
                            <div style={SECTION_CONTAINER_STYLE}>
                                <p style={SECTION_TEXT_STYLE}>
                                    <strong>Conclusions:</strong> Telehealth interventions supporting self-management are feasible and efficacious to improve asthma control and asthma-related quality of life during pregnancy.
                                </p>
                            </div>

                            {/* Keywords */}
                            <div>
                                <p style={SECTION_TEXT_STYLE}>
                                    <strong>Keywords:</strong> asthma, pregnant women, quality-of-life, telehealth
                                </p>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(AbstractExample)

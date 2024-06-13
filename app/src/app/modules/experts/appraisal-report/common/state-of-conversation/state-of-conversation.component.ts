import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AccordianName, PageName } from '../../report.mode';
@Component({
    selector: 'app-state-of-conversation',
    templateUrl: './state-of-conversation.component.html',
    styleUrls: ['./state-of-conversation.component.scss']
})
export class StateOfConversationComponent implements OnInit {

    @Input() appraisallDetails: any = {};
    @Input() page: string;
    isView = true;
    loading: boolean = false;
    accordianName = AccordianName;
    accordianOpen = false;
    StateOfConversation: any = [];
    @Output() saveData: EventEmitter<any> = new EventEmitter();
    @Input() selectAccordian: string;
    @Output() selectedAccordian: EventEmitter<any> = new EventEmitter();
    @Input() stepsCompleted: any;
    @Input() statusOfReview: string;
    currentPageState: any;
    sections = [
        { title: 'Bodywork', value: "BODY_WORK" },
        { title: 'External Operation', value: "EXTERNAL_OPERATION" },
        { title: 'Inside The Vehicle', value: "INSIDE_THE_VEHICLE" },
        { title: 'Interior Operation Of The Vehicle', value: "INTERIOR_OPERATION_OF_THE_VEHICLE" },
        { title: 'Engine', value: "ENGINE" },
        { title: 'Electric System', value: "ELECTRIC_SYSTEM" },
        { title: 'Tires', value: "TIRES" },
        { title: 'Leaks', value: "LEAKS" },
        { title: 'Front Train And Suspension', value: "FRONT_TRAIN_AND_SUSPENSION" },
        { title: 'Road Test', value: "ROAD_TEST" },
    ]

    tableRowValues = [
        {
            data: [
                {
                    "title": "No signs of previous collision",
                    "characteristics": "no_signs_of_previous_collision"
                },
                {
                    "title": "Front windshield",
                    "characteristics": "front_windshield"
                },
                {
                    "title": "Roof (paint condition, structure)",
                    "characteristics": "roof_paint_condition_structure"
                },
                {
                    "title": "Hood (paint condition, structure)",
                    "characteristics": "hood_paint_condition_structure"
                },
                {
                    "title": "Front lampposts",
                    "characteristics": "front_lampposts"
                },
                {
                    "title": "Front bumper",
                    "characteristics": "front_bumper"
                },
                {
                    "title": "Body panels",
                    "characteristics": "body_panels"
                },
                // {
                //     "title": "Door trim",
                //     "characteristics": "door_trim"
                // },
                {
                    "title": "Driver's door",
                    "characteristics": "drivers_door"
                },
                {
                    "title": "Passenger door",
                    "characteristics": "passenger_door"
                },
                {
                    "title": "Rear passenger doors",
                    "characteristics": "rear_passenger_doors"
                },
                {
                    "title": "Stirrups",
                    "characteristics": "stirrups"
                },
                {
                    "title": "Tank cover",
                    "characteristics": "tank_cover"
                },
                {
                    "title": "Rear windshield",
                    "characteristics": "rear_windshield"
                },
                // {
                //     "title": "Trunk door trim",
                //     "characteristics": "trunk_door_trim"
                // },
                {
                    "title": "Trunk",
                    "characteristics": "trunk"
                },
                {
                    "title": "Rear lamps",
                    "characteristics": "rear_lamps"
                },
                // {
                //     "title": "Rear bumper pillars of the car",
                //     "characteristics": "rear_bumper_pillars_of_the_car"
                // },
                {
                    "title": "Chassis alignment",
                    "characteristics": "chassis_alignment"
                }
            ]
        },
        {
            data: [
                {
                    "title": "Lights",
                    "characteristics": "lights"
                },
                {
                    "title": "Low lights",
                    "characteristics": "low_lights"
                },
                {
                    "title": "High beams",
                    "characteristics": "high_beams"
                },
                {
                    "title": "Firewood led",
                    "characteristics": "firewood_led"
                },
                {
                    "title": "Brake lights",
                    "characteristics": "brake_lights"
                },
                {
                    "title": "Front fog lights",
                    "characteristics": "front_fog_lights"
                },
                {
                    "title": "Rear fog lights",
                    "characteristics": "rear_fog_lights"
                },
                {
                    "title": "Directional",
                    "characteristics": "directional"
                },
                {
                    "title": "Parking lights",
                    "characteristics": "parking_lights"
                },
                {
                    "title": "Vehicle interior lights",
                    "characteristics": "vehicle_interior_lights"
                },
                {
                    "title": "Trunk lights",
                    "characteristics": "trunk_lights"
                },
                {
                    "title": "Lights on plates",
                    "characteristics": "lights_on_plates"
                },
                {
                    "title": "Convertible top (if equipped)",
                    "characteristics": "convertible_top"
                },
                {
                    "title": "Front nibs",
                    "characteristics": "front_nibs"
                },
                {
                    "title": "Hind wings",
                    "characteristics": "hind_wings"
                },
                {
                    "title": "Mirrors",
                    "characteristics": "mirrors"
                },
                {
                    "title": "Handles of all doors",
                    "characteristics": "handles_of_all_doors"
                },
                {
                    "title": "Glove box",
                    "characteristics": "glove_box"
                },
                // {
                //     "title": "Trunk handle",
                //     "characteristics": "trunk_handle"
                // }
            ]
        },
        {
            data: [
                {
                    "title": "Heating",
                    "characteristics": "heating"
                },
                {
                    "title": "Air-conditioning",
                    "characteristics": "air-conditioning"
                },
                {
                    "title": "Belts",
                    "characteristics": "belts"
                },
                {
                    "title": "Right seat",
                    "characteristics": "right_seat"
                },
                {
                    "title": "Left seat",
                    "characteristics": "left_seat"
                },
                {
                    "title": "Rear seats",
                    "characteristics": "rear_seats"
                },
                {
                    "title": "Roof condition",
                    "characteristics": "roof_condition"
                },
                {
                    "title": "Ceiling handle",
                    "characteristics": "ceiling_handle"
                },
                {
                    "title": "Roof light",
                    "characteristics": "roof_light"
                },
                {
                    "title": "Portfolios",
                    "characteristics": "portfolios"
                },
                {
                    "title": "Millare",
                    "characteristics": "millare"
                },
                {
                    "title": "Carpets",
                    "characteristics": "carpets"
                },
                {
                    "title": "Headboards",
                    "characteristics": "headboards"
                },
                {
                    "title": "Mats",
                    "characteristics": "mats"
                }
            ]
        },
        {
            data: [
                {
                    "title": "Vehicle computer scan",
                    "characteristics": "vehicle_computer_soon"
                },
                {
                    "title": "Interior lights",
                    "characteristics": "interior_lights"
                },
                {
                    "title": "Windows operation",
                    "characteristics": "windows_operation"
                },
                {
                    "title": "Rearview mirror operation",
                    "characteristics": "rearview_mirror_operation"
                },
                {
                    "title": "Rear camera (if equipped)",
                    "characteristics": "rear_camera"
                },
                {
                    "title": "Front camera (if equipped)",
                    "characteristics": "front_camera"
                },
                {
                    "title": "Vehicle steering wheel (button operation, proper steering, horn)",
                    "characteristics": "vehicle_steering_wheel"
                },
                {
                    "title": "Directional",
                    "characteristics": "directional"
                },
                // {
                //     "title": "Exterior lights",
                //     "characteristics": "exterior_lights"
                // },
                {
                    "title": "Retractable cup holders",
                    "characteristics": "retractable_cup_holders"
                },
                // {
                //     "title": "Proper glove box movement",
                //     "characteristics": "proper_glove_box_movemen"
                // },
                {
                    "title": "Functional armrest features",
                    "characteristics": "functional_armrest_features"
                },
                {
                    "title": "Movement of all chairs properly",
                    "characteristics": "movement_of_all_chairs_properly"
                },
                {
                    "title": "Belt movement",
                    "characteristics": "belt_movement"
                },
                {
                    "title": "Functional airbags",
                    "characteristics": "functional_airbags"
                },
                {
                    "title": "Internal closing control",
                    "characteristics": "internal_closing_control"
                },
                {
                    "title": "Speakers (high, low, bright)",
                    "characteristics": "speakers"
                },
                {
                    "title": "Vehicle pedals",
                    "characteristics": "vehicle_pedals"
                },
                {
                    "title": "Hand brake",
                    "characteristics": "hand_brake"
                },
                {
                    "title": "Fluid gearbox",
                    "characteristics": "fluid_gearbox"
                },
                {
                    "title": "Air conditioning (hot, cold)",
                    "characteristics": "air_conditioning"
                },
                {
                    "title": "Center navigation system",
                    "characteristics": "center_navigation_system"
                }
            ]
        },
        {
            data: [
                {
                    "title": "Start",
                    "characteristics": "start"
                },
                {
                    "title": "Radiator",
                    "characteristics": "radiator"
                },
                {
                    "title": "Engine casing",
                    "characteristics": "engine_casting"
                },
                {
                    "title": "Box casing",
                    "characteristics": "box_casting"
                },
                {
                    "title": "Gearbox",
                    "characteristics": "gearbox"
                },
                {
                    "title": "Box support",
                    "characteristics": "box_support"
                },
                {
                    "title": "Engine mount",
                    "characteristics": "engine_mount"
                },
                {
                    "title": "Engine noise",
                    "characteristics": "engine_noise"
                },
                {
                    "title": "Fans",
                    "characteristics": "fans"
                },
                {
                    "title": "Hoses",
                    "characteristics": "hoses"
                },
                {
                    "title": "Clutch condition",
                    "characteristics": "clutch_condition"
                },
                {
                    "title": "Synchronization",
                    "characteristics": "synchronization"
                },
                {
                    "title": "Delivery belt",
                    "characteristics": "delivery_belt"
                },
                {
                    "title": "Accessory strap",
                    "characteristics": "accessory_strap"
                },
                {
                    "title": "Noise in pulley and tensioners",
                    "characteristics": "noise_in_pulley_and_tensioners"
                }
            ]
        },
        {
            data: [
                // {
                //     "title": "Front panoramic",
                //     "characteristics": "front_panoramic"
                // },
                // {
                //     "title": "Rear panoramic",
                //     "characteristics": "rear_panoramic"
                // },
                // {
                //     "title": "Glasses",
                //     "characteristics": "glasses"
                // },
                // {
                //     "title": "Nibs",
                //     "characteristics": "nibs"
                // },
                // {
                //     "title": "Right lamppost",
                //     "characteristics": "right_lamppost"
                // },
                // {
                //     "title": "Left lamppost",
                //     "characteristics": "left_lamppost"
                // },
                // {
                //     "title": "Right scout",
                //     "characteristics": "right_scout"
                // },
                // {
                //     "title": "Left scout",
                //     "characteristics": "left_scout"
                // },
                // {
                //     "title": "Stop right",
                //     "characteristics": "stop_right"
                // },
                // {
                //     "title": "Stop left",
                //     "characteristics": "stop_left"
                // },
                // {
                //     "title": "Right trunk lid stop",
                //     "characteristics": "right_trunk_lid_stop"
                // },
                // {
                //     "title": "Left trunk lid stop",
                //     "characteristics": "left_trunk_lid_stop"
                // },
                // {
                //     "title": "Horn",
                //     "characteristics": "horn"
                // },
                {
                    "title": "Battery",
                    "characteristics": "battery"
                },
                {
                    "title": "Fuses",
                    "characteristics": "fuses"
                },
                {
                    "title": "Alternator",
                    "characteristics": "alternator"
                },
                {
                    "title": "License plate light",
                    "characteristics": "license_plate_light"
                }
            ]
        },
        {
            data: [
                {
                    "title": "Front tires",
                    "characteristics": "front_tires"
                },
                {
                    "title": "Rear tires",
                    "characteristics": "rear_tires"
                },
                {
                    "title": "Spare tire",
                    "characteristics": "spare_tire"
                },
                {
                    "title": "Wear",
                    "characteristics": "wear"
                },
                // {
                //     "title": "Rims condition",
                //     "characteristics": "rims_condition"
                // }
            ]
        },
        {
            data: [
                {
                    "title": "Engine oil leak",
                    "characteristics": "engine_oil_leak"
                },
                {
                    "title": "Oil leak box",
                    "characteristics": "oil_leak_box"
                },
                {
                    "title": "Refrigerant leak",
                    "characteristics": "refrigerant_leak"
                },
                {
                    "title": "Brake fluid leak",
                    "characteristics": "brake_fluid_leak"
                },
                {
                    "title": "Power steering leak",
                    "characteristics": "power_steering_leak"
                },
                {
                    "title": "Differential leak",
                    "characteristics": "differential_leak"
                }
            ]
        },
        {
            data: [
                {
                    "title": "Brake pads",
                    "characteristics": "brake_pads"
                },
                {
                    "title": "Brake discs",
                    "characteristics": "brake_discs"
                },
                {
                    "title": "Front shock absorbers",
                    "characteristics": "front_shock_absorbers"
                },
                {
                    "title": "Rear shock absorbers",
                    "characteristics": "rear_shock_absorbers"
                },
                {
                    "title": "Axle tips",
                    "characteristics": "axle_tips"
                },
                {
                    "title": "Axial",
                    "characteristics": "axial"
                },
                {
                    "title": "Terminals",
                    "characteristics": "terminals"
                },
                {
                    "title": "Ball joints",
                    "characteristics": "ball_joints"
                },
                {
                    "title": "Bushings",
                    "characteristics": "bushings"
                },
                {
                    "title": "Scissors",
                    "characteristics": "scissors"
                },
                {
                    "title": "Steering box",
                    "characteristics": "steering_box"
                },
                // {
                //     "title": "Bearings",
                //     "characteristics": "bearings"
                // }
            ]
        },
        {
            data: [
                {
                    "title": "Acceleration",
                    "characteristics": "acceleration"
                },
                {
                    "title": "Maneuverability",
                    "characteristics": "maneuverability"
                },
                {
                    "title": "Alignment angle",
                    "characteristics": "alignment_angle"
                },
                {
                    "title": "Braking condition",
                    "characteristics": "braking_condition"
                },
                {
                    "title": "Clutch condition",
                    "characteristics": "clutch_condition"
                },
                {
                    "title": "Box-engine ratio",
                    "characteristics": "box_engine_ratio"
                },
                {
                    "title": "Vibrations",
                    "characteristics": "vibrations"
                }
            ]
        },

    ]
    selectedAccordianName: any;

    constructor() {

    }

    ngOnInit(): void {
        this.setData()
    }

    setData() {
        this.sections.forEach(async (section: any, index: number) => {
            this.tableRowValues.forEach(async (ele) => {
                await ele.data.forEach((element: any) => {
                    element.okay = false;
                    element.regular = false;
                    element.bad = false;
                    element.NA = false;
                    element.title = element.title
                    element.is_complete = false;
                    element.selectedOption = null;
                    element.isError = false;
                });
            })

            await this.StateOfConversation.push({
                title: section.title,
                value: section.value,
                table_row: this.tableRowValues[index].data,
                mark_as_touch: false,
                isLoaded: true
            })
        })
        if (this.page === PageName.Add) {
            this.isView = true
            this.currentPageState = PageName.Add
            this.sections.forEach(async (section: any, index: number) => {
                let fieldName = section.value.toLowerCase()
                if (this.appraisallDetails[`${fieldName}`] != null) {
                    let data = this.appraisallDetails[`${fieldName}`]
                    for (let i = 0; i < data.length; i++) {
                        this.tableRowValues[index].data.forEach((element: any) => {
                            if (data[i].characteristics == element.characteristics) {
                                element.okay = data[i].okay;
                                element.regular = data[i].regular;
                                element.bad = data[i].bad;
                                element.NA = data[i].NA;
                                element.is_complete = true;
                                element.selectedOption = data[i].okay ? 'okay' : data[i].regular ? 'regular' : data[i].bad ? 'bad' : data[i].NA ? 'NA' : null;
                                element.isError = false;
                            }
                        })

                    }

                }
            })
        } else if (this.page === PageName.View) {
            this.sections.forEach(async (section: any, index: number) => {
                let fieldName = section.value.toLowerCase()
                if (this.appraisallDetails[`${fieldName}`] != null) {
                    let data = this.appraisallDetails[`${fieldName}`]
                    for (let i = 0; i < data.length; i++) {
                        this.tableRowValues[index].data.forEach((element: any) => {
                            if (data[i].characteristics == element.characteristics) {
                                element.okay = data[i].okay;
                                element.regular = data[i].regular;
                                element.bad = data[i].bad;
                                element.NA = data[i].NA;
                                element.is_complete = true;
                                element.selectedOption = data[i].okay ? 'okay' : data[i].regular ? 'regular' : data[i].bad ? 'bad' : data[i].NA ? 'NA' : null;
                                element.isError = false;
                            }
                        })

                    }
                }
            })

        }
    }

    selectedAccordians(sectionValue: any) {
        // this.accordianOpen = !this.accordianOpen;
        // const accordianName = this.accordianOpen ? sectionValue : null;
        // this.selectedAccordian.emit(accordianName)
        // const accordianName = this.accordianOpen ? sectionValue : null;
        // this.selectedAccordianName = accordianName;
        if (this.selectedAccordianName != sectionValue) {
          this.selectedAccordianName = sectionValue;
          this.accordianOpen = true;
        } else {
          this.accordianOpen = !this.accordianOpen;
          this.selectedAccordianName = null;
        }
        this.selectedAccordian.emit(this.selectedAccordianName);
    }

    checkedValue(index: any, i: any, value: any) {
        this.StateOfConversation[index].table_row[i].is_complete = true;
        this.StateOfConversation[index].table_row[i].isError = false;
        this.StateOfConversation[index].table_row[i].selectedOption = value;
        if (value == 'okay') {
            this.StateOfConversation[index].table_row[i][value] = true;
            this.StateOfConversation[index].table_row[i]['regular'] = false;
            this.StateOfConversation[index].table_row[i]['bad'] = false;
            this.StateOfConversation[index].table_row[i]['NA'] = false;

        } else if (value == 'regular') {
            this.StateOfConversation[index].table_row[i][value] = true;
            this.StateOfConversation[index].table_row[i]['okay'] = false;
            this.StateOfConversation[index].table_row[i]['bad'] = false;
            this.StateOfConversation[index].table_row[i]['NA'] = false;
        } else if (value == 'bad') {
            this.StateOfConversation[index].table_row[i][value] = true;
            this.StateOfConversation[index].table_row[i]['regular'] = false;
            this.StateOfConversation[index].table_row[i]['okay'] = false;
            this.StateOfConversation[index].table_row[i]['NA'] = false;
        } else if (value == 'NA') {
            this.StateOfConversation[index].table_row[i][value] = true;
            this.StateOfConversation[index].table_row[i]['regular'] = false;
            this.StateOfConversation[index].table_row[i]['bad'] = false;
            this.StateOfConversation[index].table_row[i]['okay'] = false;
        }
    }

    saveState(index: any) {
        let invalid = false;
        this.StateOfConversation[index].table_row.forEach((ele: any) => {
            ele.is_complete = true;
            if (ele.selectedOption === null) {
                invalid = true;
                ele.isError = true
            }
        })

        if (invalid) return;
        let dataRow: any[] = []
        for (let i = 0; i < this.StateOfConversation[index].table_row.length; i++) {
            let data: any = this.StateOfConversation[index].table_row;
            dataRow.push({
                okay: data[i].okay,
                regular: data[i].regular,
                bad: data[i].bad,
                NA: data[i].NA,
                characteristics: data[i].characteristics
            })
        }

        // dataRow.forEach((element: any) => {
        //     delete element.is_complete;
        //     delete element.selectedOption;
        //     delete element.title;
        //     delete element.isError;
        //     return element
        // })
        let data: any = {};
        data.current_step = this.StateOfConversation[index].value;
        const lowerCaseValue = (this.StateOfConversation[index].value).toLowerCase()
        data[`${lowerCaseValue}`] = dataRow
        this.saveData.emit(data);
    }

}

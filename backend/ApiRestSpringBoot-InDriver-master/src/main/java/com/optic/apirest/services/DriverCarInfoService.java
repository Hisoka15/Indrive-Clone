package com.optic.apirest.services;

import com.optic.apirest.dto.driver_car_info.DriverCarInfoDTO;
import com.optic.apirest.models.DriverCarInfo;
import com.optic.apirest.models.User;
import com.optic.apirest.repositories.DriverCarInfoRepository;
import com.optic.apirest.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DriverCarInfoService {

    @Autowired
    private DriverCarInfoRepository driverCarInfoRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public DriverCarInfoDTO create(DriverCarInfoDTO request) {
        User user = userRepository.findById(request.getIdDriver()).orElseThrow(
                () -> new RuntimeException("El usuario no existe")
        );

        DriverCarInfo driverCarInfo = driverCarInfoRepository.findById(request.getIdDriver()).orElse(new DriverCarInfo());

        driverCarInfo.setDriver(user);
        driverCarInfo.setBrand(request.getBrand());
        driverCarInfo.setColor(request.getColor());
        driverCarInfo.setPlate(request.getPlate());

        driverCarInfoRepository.save(driverCarInfo);

        return request;
    }

    @Transactional
    public DriverCarInfoDTO findByIdDriver(Long idDriver) {
        DriverCarInfo driverCarInfo = driverCarInfoRepository.findById(idDriver).orElseThrow(
                () -> new RuntimeException("La informacion del vehiculo no existe")
        );
        DriverCarInfoDTO response = new DriverCarInfoDTO();
        response.setIdDriver(driverCarInfo.getIdDriver());
        response.setBrand(driverCarInfo.getBrand());
        response.setColor(driverCarInfo.getColor());
        response.setPlate(driverCarInfo.getPlate());

        return response;

    }

}

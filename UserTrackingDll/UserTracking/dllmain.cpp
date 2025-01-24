#include "pch.h"
#include <windows.h> 
#include <string>
#include <psapi.h>

//**
// 导出函数，获取当前活动窗口的应用程序名称
// **/
extern "C" __declspec(dllexport) const char* GetActiveWindowAppName() {
    // 获取当前活动窗口的句柄
    HWND hwnd = GetForegroundWindow();
    if (hwnd == NULL) {
        return "No active window";
    }

    // 获取活动窗口所属的进程ID
    DWORD processID;
    GetWindowThreadProcessId(hwnd, &processID);

    // 打开进程以查询信息和读取内存
    HANDLE hProcess = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, FALSE, processID);
    if (hProcess == NULL) {
        return "Unable to open process";
    }

    // 获取进程的可执行文件名，因为获取到的是绝对路径，所以需要进行处理
    char processName[MAX_PATH];
    if (GetModuleFileNameExA(hProcess, NULL, processName, sizeof(processName) / sizeof(char))) {
        std::string fullPath(processName);
        std::string appName = fullPath.substr(fullPath.find_last_of("\\") + 1);
        appName = appName.substr(0, appName.find_last_of("."));

        CloseHandle(hProcess);
        return _strdup(appName.c_str());
    }

    CloseHandle(hProcess);
    return "Unable to get process name";
}

//**
// dll的入口点
// **//
BOOL APIENTRY DllMain(HMODULE hModule,
    DWORD  ul_reason_for_call,
    LPVOID lpReserved) {
    switch (ul_reason_for_call) {
    case DLL_PROCESS_ATTACH:
    case DLL_THREAD_ATTACH:
    case DLL_THREAD_DETACH:
    case DLL_PROCESS_DETACH:
        break;
    }
    return TRUE;
}
